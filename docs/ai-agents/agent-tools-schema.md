---
title: Tool Calling & Function Schemas
sidebar_position: 3
---

# Tool Calling & Function Schemas

This reference provides standard **JSON Tool / Function Calling Schemas** for AI developers integrating AI Hedge ERC-4626 vaults into LLM frameworks including **OpenAI Function Calling**, **Anthropic Tool Use**, **Coinbase AgentKit**, **ElizaOS**, and **LangChain**.

:::note[Developer / Advanced Topic]
**Target Audience**: This technical reference is intended for **AI Developers, Bot Builders, and Software Engineers** integrating AI Hedge vaults into programmatic LLM agent pipelines (OpenAI Function Calling, Anthropic Tool Use, LangChain, Coinbase AgentKit, ElizaOS).

If you are a non-coder looking for ready-to-use copy-paste prompts, see the **[Prompt Playbook for ChatGPT & Claude](./prompt-playbook)** instead.
:::

---

## 1. OpenAI / Anthropic Tool Definitions

Copy and paste these standard tool schemas directly into your LLM agent initialization:

```json
[
  {
    "type": "function",
    "function": {
      "name": "get_vault_metrics",
      "description": "Fetches real-time TVL (totalAssets), Price Per Share, and token decimals for an AI Hedge ERC-4626 vault.",
      "parameters": {
        "type": "object",
        "properties": {
          "vault_address": {
            "type": "string",
            "description": "The Ethereum/Base checksummed contract address of the AI Hedge vault (e.g. '0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871')."
          },
          "chain_id": {
            "type": "number",
            "description": "Chain ID (8453 for Base, 1 for Ethereum Mainnet).",
            "default": 8453
          }
        },
        "required": ["vault_address"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "preview_vault_deposit",
      "description": "Simulates a deposit into the AI Hedge vault and returns the exact expected shares to be minted.",
      "parameters": {
        "type": "object",
        "properties": {
          "vault_address": {
            "type": "string",
            "description": "The contract address of the AI Hedge vault."
          },
          "assets_amount_human": {
            "type": "string",
            "description": "The amount of underlying asset to deposit in standard human-readable units (e.g., '100.5' for 100.5 USDC)."
          }
        },
        "required": ["vault_address", "assets_amount_human"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "get_user_vault_position",
      "description": "Queries the vault share balance and calculates the underlying asset value in USDC for a specific user wallet.",
      "parameters": {
        "type": "object",
        "properties": {
          "vault_address": {
            "type": "string",
            "description": "The contract address of the AI Hedge vault."
          },
          "user_address": {
            "type": "string",
            "description": "The user's EVM wallet address."
          }
        },
        "required": ["vault_address", "user_address"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "build_vault_deposit_calldata",
      "description": "Builds the transaction calldata for ERC-20 approval and ERC-4626 vault deposit, applying strict slippage boundaries.",
      "parameters": {
        "type": "object",
        "properties": {
          "vault_address": {
            "type": "string",
            "description": "The target AI Hedge vault address."
          },
          "asset_address": {
            "type": "string",
            "description": "The underlying ERC-20 token address (e.g. USDC)."
          },
          "amount_human": {
            "type": "string",
            "description": "Deposit amount in human readable units (e.g. '500')."
          },
          "receiver_address": {
            "type": "string",
            "description": "The address that will receive the minted vault shares."
          },
          "slippage_bps": {
            "type": "number",
            "description": "Maximum allowed slippage in basis points (default: 50 = 0.5%).",
            "default": 50
          }
        },
        "required": ["vault_address", "asset_address", "amount_human", "receiver_address"]
      }
    }
  }
]
```

---

## 2. Python Implementation Example (OpenAI Function Calling)

:::warning[Sample Code Only]
The code and schemas below are illustrative integration examples only. Before deploying autonomous agents or bots to production with real capital, conduct your own security reviews and test on testnets or fork environments.
:::

Below is an end-to-end Python implementation demonstrating how an LLM agent resolves user intent and invokes on-chain reads:

```python
import os
from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))

VAULT_ABI = [
    {"name": "totalAssets", "inputs": [], "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"name": "decimals", "inputs": [], "outputs": [{"type": "uint8"}], "stateMutability": "view", "type": "function"},
    {"name": "convertToAssets", "inputs": [{"type": "uint256"}], "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"name": "previewDeposit", "inputs": [{"type": "uint256"}], "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"name": "balanceOf", "inputs": [{"type": "address"}], "outputs": [{"type": "uint256"}], "stateMutability": "view", "type": "function"},
]

def execute_agent_tool(tool_name: str, args: dict) -> dict:
    """Executes the tool requested by the AI agent."""
    vault_address = Web3.to_checksum_address(args["vault_address"])
    vault = w3.eth.contract(address=vault_address, abi=VAULT_ABI)

    if tool_name == "get_vault_metrics":
        total_assets = vault.functions.totalAssets().call()
        decimals = vault.functions.decimals().call()
        pps = vault.functions.convertToAssets(10 ** decimals).call()
        return {
            "total_assets_human": total_assets / (10 ** decimals),
            "price_per_share_human": pps / (10 ** decimals),
            "decimals": decimals
        }

    elif tool_name == "preview_vault_deposit":
        decimals = vault.functions.decimals().call()
        assets_raw = int(float(args["assets_amount_human"]) * (10 ** decimals))
        expected_shares = vault.functions.previewDeposit(assets_raw).call()
        return {
            "assets_raw": str(assets_raw),
            "expected_shares_human": expected_shares / (10 ** decimals),
            "expected_shares_raw": str(expected_shares)
        }

    elif tool_name == "get_user_vault_position":
        user_address = Web3.to_checksum_address(args["user_address"])
        decimals = vault.functions.decimals().call()
        shares = vault.functions.balanceOf(user_address).call()
        underlying_value = vault.functions.convertToAssets(shares).call() if shares > 0 else 0
        return {
            "shares_human": shares / (10 ** decimals),
            "underlying_value_human": underlying_value / (10 ** decimals)
        }

    return {"error": f"Unknown tool {tool_name}"}
```

---

## 3. Recommended Slippage & Guardrail Logic for Agents

When building autonomous agents that execute transactions:

```python
# Always enforce slippage bound before submitting calldata:
expected_shares = vault.functions.previewDeposit(deposit_amount).call()
slippage_bps = 50 # 0.5%
min_shares_acceptable = (expected_shares * (10000 - slippage_bps)) // 10000

# Agent should revert if estimated shares output is zero or below threshold
assert min_shares_acceptable > 0, "Slippage error: zero shares output previewed"
```
