---
title: Contract Addresses & Registry
sidebar_position: 2
---

# Contract Addresses & Registry

This registry provides official smart contract addresses for AI Hedge multi-strategy yield vaults and underlying asset tokens across supported networks.

---

## Ethereum Mainnet (Chain ID: 1)

| Name | Type | Contract Address | Decimals | Explorer |
| :--- | :--- | :--- | :--- | :--- |
| **USDC AI Hedge Multi-Strategy Vault** | ERC-4626 Vault | `0x469201fa49db171c0f95371533c2d3ad5ae60400` | 6 | [Etherscan](https://etherscan.io/address/0x469201fa49db171c0f95371533c2d3ad5ae60400) |
| **USDC (Underlying Asset)** | ERC-20 Asset | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | 6 | [Etherscan](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |

---

## Base (Chain ID: 8453)

| Name | Type | Contract Address | Decimals | Explorer |
| :--- | :--- | :--- | :--- | :--- |
| **USDC AI Hedge Vault** | ERC-4626 Vault | `0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871` | 6 | [Basescan](https://basescan.org/address/0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871) |
| **USDC (Native Asset)** | ERC-20 Asset | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | 6 | [Basescan](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) |

---

## Verification & Security

All AI Hedge smart contracts are verified with open-source Solidity code directly on block explorers (Etherscan, Basescan).

:::info[Important Security Note]
When interacting directly with smart contracts, always ensure you approve and interact with the exact **ERC-4626 Vault Address** for the underlying token. The vault contract autonomously manages allocations and deposits across underlying strategies.
:::

---

> Each address above implements the **[ERC-4626 vault interface](./erc4626-standard)** — use `deposit()`, `redeem()`, `convertToAssets()`, and `previewDeposit()` directly on these addresses without any additional contract interactions.

