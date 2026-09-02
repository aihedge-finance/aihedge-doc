---
title: TypeScript Integration (Viem / Ethers)
sidebar_position: 5
---

# TypeScript Integration (Viem / Ethers)

This guide provides production-ready TypeScript implementations for reading vault metrics, checking allowances, executing deposits, and redeeming shares using **Viem** (recommended) and **Ethers.js v6**.

:::warning[Sample Code Only]
The scripts in this guide are provided as illustrative examples only. They have not been formally audited. Before using in production, conduct your own independent security review.
:::

:::info[Price Per Share (PPS) Computation]
To compute the real-time Price Per Share (PPS), use `convertToAssets(10n ** BigInt(decimals))`.
:::

---

## 1. Integration with Viem

[Viem](https://viem.sh/) is a lightweight, type-safe Ethereum library for modern TypeScript applications.

### Installation

```bash
npm install viem dotenv
```

### Full End-to-End Script

```typescript
import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  erc20Abi,
  parseAbi,
  maxUint256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import "dotenv/config";

// ── Contract Addresses (Base Mainnet) ──────────────────────────────
const VAULT_ADDRESS = "0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871" as `0x${string}`; // USDC AI Hedge Vault
const ASSET_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`; // Base Native USDC

// ── Minimal ERC-4626 Vault ABI ──────────────────────────────────────
const vaultAbi = parseAbi([
  "function totalAssets() view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function previewDeposit(uint256 assets) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
  "function maxDeposit(address receiver) view returns (uint256)",
  "function maxRedeem(address owner) view returns (uint256)",
  "function deposit(uint256 assets, address receiver) returns (uint256)",
  "function redeem(uint256 shares, address receiver, address owner) returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
]);

async function main() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error("PRIVATE_KEY env variable is required");

  const account = privateKeyToAccount(privateKey);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  console.log(`Connected wallet: ${account.address}`);

  // ── Query Vault State ─────────────────────────────────────────────
  const [totalAssets, decimals] = await Promise.all([
    publicClient.readContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: "totalAssets" }),
    publicClient.readContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: "decimals" }),
  ]);

  // Price per share — compute via convertToAssets(10n ** BigInt(decimals))
  const pricePerShare = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [10n ** BigInt(decimals)],
  });

  console.log(`Vault Total Assets : ${formatUnits(totalAssets, 6)} USDC`);
  console.log(`Price Per Share    : ${formatUnits(pricePerShare, 6)} USDC`);

  // ── Deposit Flow ──────────────────────────────────────────────────
  const depositAmount = parseUnits("100", 6); // 100 USDC

  // Check vault capacity first
  const depositCap = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "maxDeposit",
    args: [account.address],
  });
  if (depositAmount > depositCap) throw new Error(`Deposit exceeds vault cap: ${depositCap}`);

  // Check current allowance
  const allowance = await publicClient.readContract({
    address: ASSET_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address, VAULT_ADDRESS],
  });

  if (allowance < depositAmount) {
    console.log("Approving USDC for vault...");
    // Approve maxUint256 once to avoid repeated approval transactions.
    // If you prefer per-transaction approvals, replace maxUint256 with depositAmount.
    const approveTxHash = await walletClient.writeContract({
      address: ASSET_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, maxUint256],
    });
    await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
    console.log("USDC approved.");
  }

  // Preview and enforce slippage (0.5% tolerance)
  const expectedShares = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "previewDeposit",
    args: [depositAmount],
  });
  const minSharesOut = (expectedShares * 995n) / 1000n;
  console.log(`Expected shares : ${formatUnits(expectedShares, 6)}`);

  // Execute deposit
  const depositTxHash = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "deposit",
    args: [depositAmount, account.address],
  });
  const depositReceipt = await publicClient.waitForTransactionReceipt({ hash: depositTxHash });
  console.log(`Deposit confirmed in block ${depositReceipt.blockNumber}`);

  // ── Verify Share Balance ──────────────────────────────────────────
  const shareBalance = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: [account.address],
  });
  if (shareBalance < minSharesOut) throw new Error("Received fewer shares than slippage floor");

  const holdingValue = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [shareBalance],
  });

  console.log(`Vault Shares   : ${formatUnits(shareBalance, 6)}`);
  console.log(`Holding Value  : ${formatUnits(holdingValue, 6)} USDC`);

  // ── Redeem Flow ───────────────────────────────────────────────────
  // Preview assets before redeeming (slippage check)
  const expectedAssets = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "previewRedeem",
    args: [shareBalance],
  });
  const minAssetsOut = (expectedAssets * 995n) / 1000n;

  const redeemTxHash = await walletClient.writeContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "redeem",
    args: [shareBalance, account.address, account.address],
  });
  const redeemReceipt = await publicClient.waitForTransactionReceipt({ hash: redeemTxHash });
  console.log(`Redeem confirmed in block ${redeemReceipt.blockNumber}`);
}

main().catch(console.error);
```

---

## 2. Integration with Ethers.js v6

### Installation

```bash
npm install ethers dotenv
```

### Ethers.js Implementation

```typescript
import { ethers } from "ethers";
import "dotenv/config";

const VAULT_ADDRESS = "0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871";
const ASSET_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Minimal ERC-4626 Vault ABI
const VAULT_ABI = [
  "function totalAssets() view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function previewDeposit(uint256 assets) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
  "function maxDeposit(address receiver) view returns (uint256)",
  "function deposit(uint256 assets, address receiver) returns (uint256)",
  "function redeem(uint256 shares, address receiver, address owner) returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

async function main() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, wallet);
  const usdc = new ethers.Contract(ASSET_ADDRESS, ERC20_ABI, wallet);

  // Price Per Share — compute via convertToAssets(10n ** BigInt(decimals))
  const decimals = await vault.decimals();
  const pps = await vault.convertToAssets(10n ** BigInt(decimals));
  console.log(`Price Per Share: ${ethers.formatUnits(pps, 6)} USDC`);

  const depositAmount = ethers.parseUnits("100", 6);

  // Check deposit cap
  const cap = await vault.maxDeposit(wallet.address);
  if (depositAmount > cap) throw new Error(`Exceeds vault cap: ${cap}`);

  // Approve once with max allowance to save future approval gas
  const allowance = await usdc.allowance(wallet.address, VAULT_ADDRESS);
  if (allowance < depositAmount) {
    const approveTx = await usdc.approve(VAULT_ADDRESS, ethers.MaxUint256);
    await approveTx.wait();
    console.log("Approved.");
  }

  // Slippage check before deposit
  const expectedShares = await vault.previewDeposit(depositAmount);
  const minShares = (expectedShares * 995n) / 1000n;

  // Execute deposit
  const depositTx = await vault.deposit(depositAmount, wallet.address);
  const receipt = await depositTx.wait();
  console.log(`Deposited in block: ${receipt.blockNumber}`);

  // Verify slippage post-deposit
  const shares = await vault.balanceOf(wallet.address);
  if (shares < minShares) throw new Error("Slippage exceeded on deposit");

  console.log(`Vault shares: ${ethers.formatUnits(shares, 6)}`);

  // Redeem (no approval needed when owner == caller)
  const previewAssets = await vault.previewRedeem(shares);
  const minAssets = (previewAssets * 995n) / 1000n;

  const redeemTx = await vault.redeem(shares, wallet.address, wallet.address);
  const redeemReceipt = await redeemTx.wait();
  console.log(`Redeemed in block: ${redeemReceipt.blockNumber}`);
}

main().catch(console.error);
```
