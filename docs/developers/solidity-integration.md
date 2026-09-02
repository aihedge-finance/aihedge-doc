---
title: Solidity Smart Contract Integration
sidebar_position: 4
---

# Solidity Smart Contract Integration

This guide provides a production-grade Solidity contract for protocols, DAO treasuries, and on-chain allocators integrating with AI Hedge ERC-4626 multi-strategy vaults.

:::warning[Sample Code Only]
The contracts and snippets in this guide are provided as illustrative examples only. They have not been formally audited. Before deploying to mainnet, you must conduct your own independent security review and smart contract audit.
:::

---

## 1. Production Contract: `TreasuryVaultAllocator.sol`

This contract manages automated capital allocation into an AI Hedge vault, enforces slippage bounds on deposits and redemptions, and supports real-time NAV queries.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Minimal ERC-4626 interface for AI Hedge vaults.
/// Use convertToAssets(10**decimals()) for computing Price Per Share (PPS).
interface IAIHedgeVault is IERC20 {
    function totalAssets() external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);
    function previewDeposit(uint256 assets) external view returns (uint256 shares);
    function previewRedeem(uint256 shares) external view returns (uint256 assets);
    function maxDeposit(address receiver) external view returns (uint256);
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
}

/// @title TreasuryVaultAllocator
/// @notice Manages non-custodial capital allocation into AI Hedge ERC-4626 yield vaults.
/// @dev Designed for DAO treasuries and institutional allocators using Gnosis Safe.
contract TreasuryVaultAllocator is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IAIHedgeVault public immutable vault;
    IERC20 public immutable asset;

    // ── Custom Errors ─────────────────────────────────────────────────
    error SlippageExceeded(uint256 received, uint256 minimum);
    error ZeroAmount();
    error ExceedsVaultDepositLimit(uint256 requested, uint256 limit);

    // ── Events ────────────────────────────────────────────────────────
    event CapitalAllocated(uint256 assetsDeposited, uint256 sharesReceived);
    event CapitalWithdrawn(uint256 sharesRedeemed, uint256 assetsReceived);

    /// @param _vault AI Hedge ERC-4626 vault address
    /// @param _asset Underlying ERC-20 asset address (e.g., USDC)
    /// @param _initialOwner Treasury multisig or governance address
    constructor(address _vault, address _asset, address _initialOwner) Ownable(_initialOwner) {
        vault = IAIHedgeVault(_vault);
        asset = IERC20(_asset);
        // Grant max allowance to vault once — saves per-deposit approval gas.
        // Safe because vault is immutable and we trust the deployed contract.
        asset.forceApprove(_vault, type(uint256).max);
    }

    /// @notice Deposit assets into the vault with slippage protection.
    /// @param assets Amount of underlying asset tokens to deposit.
    /// @param minSharesOut Minimum vault shares to receive (revert on slippage).
    function allocateCapital(
        uint256 assets,
        uint256 minSharesOut
    ) external onlyOwner nonReentrant returns (uint256 shares) {
        if (assets == 0) revert ZeroAmount();

        // Check vault deposit cap before pulling tokens
        uint256 depositLimit = vault.maxDeposit(address(this));
        if (assets > depositLimit) revert ExceedsVaultDepositLimit(assets, depositLimit);

        asset.safeTransferFrom(msg.sender, address(this), assets);

        shares = vault.deposit(assets, address(this));

        if (shares < minSharesOut) revert SlippageExceeded(shares, minSharesOut);

        emit CapitalAllocated(assets, shares);
    }

    /// @notice Redeem vault shares back to the underlying asset.
    /// @param shares Amount of vault shares to burn.
    /// @param minAssetsOut Minimum underlying assets to receive.
    /// @param recipient Address that will receive the redeemed assets.
    function withdrawCapital(
        uint256 shares,
        uint256 minAssetsOut,
        address recipient
    ) external onlyOwner nonReentrant returns (uint256 assets) {
        if (shares == 0) revert ZeroAmount();

        assets = vault.redeem(shares, recipient, address(this));

        if (assets < minAssetsOut) revert SlippageExceeded(assets, minAssetsOut);

        emit CapitalWithdrawn(shares, assets);
    }

    /// @notice Returns the current underlying value of this contract's vault holdings.
    function getTreasuryValuation() external view returns (uint256) {
        uint256 shares = vault.balanceOf(address(this));
        return vault.convertToAssets(shares);
    }

    /// @notice Returns Price Per Share (PPS) in underlying asset units.
    /// @dev Computes PPS via convertToAssets(10 ** decimals()).
    ///      For a 6-decimal USDC vault, convertToAssets(1_000_000) returning 1_045_321 means PPS = 1.045321 USDC.
    function getPricePerShare() external view returns (uint256) {
        return vault.convertToAssets(10 ** vault.decimals());
    }
}
```

---

## 2. Testing with Foundry (Local Base Fork)

Fork Base Mainnet to test against live contract state:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TreasuryVaultAllocator.sol";

contract VaultIntegrationTest is Test {
    // Base Mainnet addresses
    address constant BASE_USDC_VAULT = 0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871;
    address constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    TreasuryVaultAllocator public allocator;
    address public treasury = makeAddr("treasury");

    function setUp() public {
        // Fork Base Mainnet
        vm.createSelectFork("https://mainnet.base.org");

        // Deploy allocator
        vm.prank(treasury);
        allocator = new TreasuryVaultAllocator(
            BASE_USDC_VAULT,
            BASE_USDC,
            treasury
        );

        // Fund treasury with 50,000 USDC using Foundry deal cheatcode
        deal(BASE_USDC, treasury, 50_000 * 1e6);
    }

    function test_DepositAndRedeemFlow() public {
        uint256 depositAmount = 10_000 * 1e6; // 10,000 USDC

        vm.startPrank(treasury);
        IERC20(BASE_USDC).approve(address(allocator), depositAmount);

        // Simulate expected shares before depositing
        uint256 expectedShares = IAIHedgeVault(BASE_USDC_VAULT).previewDeposit(depositAmount);
        uint256 minShares = (expectedShares * 995) / 1000; // 0.5% max slippage

        // Execute deposit
        uint256 shares = allocator.allocateCapital(depositAmount, minShares);
        assertGe(shares, minShares, "Shares below slippage floor");

        // NAV should match deposit within rounding (shares are 1:1 at first deposit)
        uint256 valuation = allocator.getTreasuryValuation();
        assertApproxEqAbs(valuation, depositAmount, 100, "Valuation mismatch");

        // NOTE: vm.warp does not automatically trigger yield harvests on a fork.
        // Real yield accrual requires keeper harvest calls on strategies.
        // This test verifies the deposit/redeem round-trip, not yield generation.

        // Redeem all shares
        uint256 previewAssets = IAIHedgeVault(BASE_USDC_VAULT).previewRedeem(shares);
        uint256 minAssets = (previewAssets * 995) / 1000;

        uint256 assetsReceived = allocator.withdrawCapital(shares, minAssets, treasury);
        assertGe(assetsReceived, minAssets, "Assets below slippage floor");

        vm.stopPrank();
    }
}
```

Run with Foundry:
```bash
forge test --fork-url https://mainnet.base.org --match-test test_DepositAndRedeemFlow -vvv
```
