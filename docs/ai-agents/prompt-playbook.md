---
title: Prompt Playbook (ChatGPT & Claude)
sidebar_position: 2
---

# Prompt Playbook for ChatGPT & Claude

This playbook provides copy-paste prompt templates for non-technical allocators, DAO operators, and "vibe coders" using ChatGPT, Claude, or Cursor to analyze, monitor, and interact with AI Hedge yield vaults.

:::info[Prerequisite: Wallet Address & Secret Key Setup]
Before using prompt templates that generate local scripts, bots, or transaction payloads:
1. **Public Wallet Address**: You will need your EVM public address (e.g. `0x...`) to track positions and format calldata.
2. **Wallet Secret / Private Key**: For automated bots or script execution, you will need the secret private key belonging to your wallet. If you need help locating it, see the complete guide: **➡️ [Finding Your Wallet Secret & Private Key](./wallet-secrets-guide)**.
3. **Dedicated Agent Wallet**: We strongly recommend creating a dedicated sub-wallet with limited funds for agent tasks. **Never** input raw private keys or seed phrases into public web LLM chat interfaces.
:::

---

## 1. System Prompt for Custom GPT / Claude Project

To create a dedicated **AI Hedge Assistant** in ChatGPT (Custom GPT) or Claude (Projects), copy this prompt into the **System Instructions**:

```markdown
You are an expert on-chain analyst and assistant for AI Hedge ERC-4626 Yield Vaults.
Your goal is to help users query on-chain vault metrics, calculate yields, explain vault mechanics, and prepare transaction parameters.

Core Vault Rules & Knowledge:
1. All AI Hedge vaults implement the standard ERC-4626 Tokenized Vault interface.
2. The primary live vaults are:
   - Base USDC Vault: 0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871 (Underlying: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 6 decimals)
   - Ethereum USDC Vault: 0x469201fa49db171c0f95371533c2d3ad5ae60400 (Underlying: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 6 decimals)
3. Standard functions:
   - totalAssets(): returns total underlying assets in vault
   - convertToAssets(shares): returns the underlying value of a share balance
   - previewDeposit(assets): returns expected shares for a given deposit
   - previewRedeem(shares): returns expected assets for a given share redemption
   - Price Per Share (PPS) = convertToAssets(10 ** decimals)
4. Always compute slippage protection (e.g. minSharesOut = previewDeposit * 0.995 for 0.5% max slippage).
5. When writing scripts or preparing transaction payloads, format big numbers as string-safe integers or using ethers/viem parseUnits.
```

---

## 2. Prompt Templates for Non-Coders

### Prompt A: "Analyze My Vault Position"
Use this prompt when you want an LLM to calculate your earnings, current value, and profit from raw on-chain data:

```markdown
I deposited into the AI Hedge USDC Vault on Base (Address: 0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871).

Here is my current position data from the block explorer:
- My Vault Share Balance: [INSERT SHARES, e.g. 10450.25]
- Initial USDC Deposited: [INSERT INITIAL AMOUNT, e.g. 10000 USDC]
- Current Price Per Share: [INSERT PPS, e.g. 1.045321]

Please calculate:
1. Current total value of my holding in USDC.
2. Net yield earned (in USDC and in percentage return).
3. Annualized APY if I have held this position for [INSERT NUMBER, e.g. 45] days.
```

---

### Prompt B: "Prepare Safe Transaction Builder Calldata"
Use this prompt when you need to execute a deposit or redemption through a **Gnosis Safe Multisig** without writing any code:

```markdown
I need to execute a deposit of [INSERT AMOUNT, e.g. 25000] USDC into the AI Hedge Vault on Base.

Contract Details:
- Vault Address: 0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871
- USDC Asset Address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- My Safe Address: [INSERT YOUR SAFE ADDRESS]

Please generate the exact step-by-step inputs for the Gnosis Safe Transaction Builder:
1. Transaction 1: USDC.approve(vaultAddress, amountInWei)
2. Transaction 2: Vault.deposit(assetsInWei, receiverAddress)

Include the exact decimal conversions (USDC has 6 decimals) and function signatures so I can paste them directly into Safe UI.
```

---

### Prompt C: "Generate a Custom Telegram Alert Bot Script"
Use this prompt to ask Claude or ChatGPT to generate a lightweight alert script for your server:

```markdown
Write a lightweight Python script using Web3.py that monitors the AI Hedge USDC Vault on Base (0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871).

Requirements:
1. Connects to Base Mainnet via free public RPC (https://mainnet.base.org).
2. Every 6 hours, queries `convertToAssets(1000000)` to get the latest Price Per Share.
3. If Price Per Share increases, sends a formatted Telegram notification with the updated PPS and estimated 7-day annualized APY.
4. Load the Telegram Bot Token and Chat ID securely from a `.env` file.
```

---

### Prompt D: "Verify Slippage & Previews Before Depositing"
Use this prompt to confirm exact output before sending a large transaction:

```markdown
I am preparing to deposit [INSERT AMOUNT, e.g. 50000] USDC into the AI Hedge Base Vault (0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871).
The previewDeposit function returned [INSERT PREVIEW VALUE] shares.

Please:
1. Explain what this preview value means in terms of exchange rate.
2. Calculate the minimum acceptable shares out at 0.1%, 0.5%, and 1.0% slippage tolerances.
3. Format the exact parameters for `deposit(uint256 assets, address receiver)`.
```
