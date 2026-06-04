---
title: Depositing & Withdrawing
sidebar_position: 2
---

# Depositing & Withdrawing

Interacting with AIHedge vaults is straightforward. You deposit a supported asset, receive vault shares in return, and can redeem those shares for your principal plus accumulated yield at any time.

---

## Before You Start

- ✅ Your Web3 wallet is connected (MetaMask, OKX Wallet, or WalletConnect)
- ✅ You are on the correct network (Ethereum, Arbitrum, Base, BNB Chain, or Optimism)
- ✅ You hold the asset the vault accepts (e.g. USDC for a USDC vault)
- ✅ You have a small amount of the native token (ETH, BNB, etc.) for gas fees

---

## How to Deposit

1. **Open the Vault** — Navigate to the Vaults Marketplace and click the vault you want to deposit into.

2. **Enter an amount** — Type the amount of the asset you want to deposit, or click **Max** to use your full balance.

3. **Approve (first time only)** — If this is your first deposit, you'll need to approve the vault contract to spend your token. Click **Approve** and confirm the transaction in your wallet.

4. **Deposit** — Click **Deposit** and confirm the transaction in your wallet.

5. **Receive vault shares** — Once the transaction confirms, you'll receive ERC-4626 vault share tokens in your wallet. These represent your proportional ownership of the vault and grow in value as yield accrues.

![Deposit Panel](/img/dapp/vault_deposit_panel_1780574527588.png)

---

## How to Withdraw

1. **Open the Vault** — Go to the same vault page where you deposited.

2. **Switch to Withdraw tab** — Click the **Withdraw** tab in the deposit/withdraw panel.

3. **Enter an amount** — Enter the amount you want to withdraw (in the underlying asset, e.g. USDC), or click **Max** to redeem all your shares.

4. **Withdraw** — Click **Withdraw** and confirm in your wallet. Your vault shares are burned and the underlying assets are returned to your wallet.

![Withdraw Tab](/img/dapp/vault_withdraw_tab_1780574547200.png)

---

## Notes

- **No lockup** — Withdrawals are available at any time, subject to vault liquidity.
- **Yield included** — When you withdraw, you receive your original deposit **plus** all accumulated yield.
- **Gas fees** — Each deposit and withdrawal requires a small on-chain gas fee in the network's native token.
- **Vault shares** — Your position is represented as ERC-4626 share tokens, which can be held, transferred, or used in other DeFi protocols that support the standard.
