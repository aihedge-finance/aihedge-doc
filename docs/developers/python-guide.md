---
title: Python Integration (Web3.py)
sidebar_position: 6
---

# Python Integration (Web3.py)

This guide provides a production-ready Python script for automated treasury systems, analytics bots, and quantitative allocators integrating directly with AI Hedge ERC-4626 yield vaults.

:::warning[Sample Code Only]
The scripts in this guide are provided as illustrative examples only. They have not been formally audited. Before using in production, conduct your own independent security review.
:::

## Installation

```bash
pip install web3 python-dotenv
```

## Environment Setup

Create a `.env` file in your project root:

```bash
RPC_URL=https://mainnet.base.org
PRIVATE_KEY=0x...
```

:::danger[Security Reminder]
Never commit your `.env` file containing private keys. Ensure it is added to `.gitignore`.
:::

## Full End-to-End Script (`vault_interact.py`)

```python
import os
from web3 import Web3
from dotenv import load_dotenv  # pip install python-dotenv

load_dotenv()

RPC_URL     = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# ── Contract Addresses (Base Mainnet) ─────────────────────────────────
VAULT_ADDRESS = Web3.to_checksum_address("0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871")
USDC_ADDRESS  = Web3.to_checksum_address("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")

# ── Minimal ERC-4626 ABI ───────────────────────────────────────────────
# Matches the standard on-chain vault interface.
ERC4626_ABI = [
    {
        "name": "totalAssets",
        "inputs": [],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "convertToAssets",
        "inputs": [{"name": "shares", "type": "uint256"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "previewDeposit",
        "inputs": [{"name": "assets", "type": "uint256"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "previewRedeem",
        "inputs": [{"name": "shares", "type": "uint256"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "maxDeposit",
        "inputs": [{"name": "receiver", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "deposit",
        "inputs": [
            {"name": "assets", "type": "uint256"},
            {"name": "receiver", "type": "address"},
        ],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "name": "redeem",
        "inputs": [
            {"name": "shares", "type": "uint256"},
            {"name": "receiver", "type": "address"},
            {"name": "owner", "type": "address"},
        ],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "name": "balanceOf",  # Returns vault share balance (not USDC balance)
        "inputs": [{"name": "account", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "decimals",
        "inputs": [],
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function",
    },
]

ERC20_ABI = [
    {
        "name": "allowance",
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "spender", "type": "address"},
        ],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "name": "approve",
        "inputs": [
            {"name": "spender", "type": "address"},
            {"name": "amount", "type": "uint256"},
        ],
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "name": "balanceOf",
        "inputs": [{"name": "account", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
]


def build_tx_params(w3: Web3, sender: str) -> dict:
    """
    Build gas parameters dynamically from the network.
    Avoids hardcoded gwei values that may be too low on Base.
    """
    base_fee = w3.eth.get_block("latest")["baseFeePerGas"]
    priority_fee = w3.eth.max_priority_fee
    return {
        "from": sender,
        "nonce": w3.eth.get_transaction_count(sender),
        "maxFeePerGas": base_fee * 2 + priority_fee,   # 2x base fee headroom
        "maxPriorityFeePerGas": priority_fee,
    }


def main():
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    assert w3.is_connected(), "Failed to connect to RPC"

    account = w3.eth.account.from_key(PRIVATE_KEY)
    my_address = account.address
    print(f"Connected wallet: {my_address}")

    vault = w3.eth.contract(address=VAULT_ADDRESS, abi=ERC4626_ABI)
    usdc  = w3.eth.contract(address=USDC_ADDRESS,  abi=ERC20_ABI)

    # ── 1. Read Vault State ─────────────────────────────────────────────
    total_assets = vault.functions.totalAssets().call()
    decimals     = vault.functions.decimals().call()

    # Price Per Share: compute via convertToAssets(10 ** decimals)
    pps = vault.functions.convertToAssets(10 ** decimals).call()

    print(f"Vault Total Assets : {total_assets / 1e6:,.2f} USDC")
    print(f"Price Per Share    : {pps / 1e6:.6f} USDC")

    # ── 2. Check Balances ───────────────────────────────────────────────
    usdc_balance  = usdc.functions.balanceOf(my_address).call()
    share_balance = vault.functions.balanceOf(my_address).call()
    holding_value = vault.functions.convertToAssets(share_balance).call() if share_balance > 0 else 0

    print(f"Wallet USDC Balance: {usdc_balance / 1e6:,.2f} USDC")
    print(f"Vault Shares       : {share_balance / 1e6:,.6f} | Value: {holding_value / 1e6:,.2f} USDC")

    # ── 3. Deposit 100 USDC ─────────────────────────────────────────────
    deposit_amount = 100 * 10**6  # Use integer arithmetic — not float 100 * 1e6

    # Check vault deposit cap
    deposit_cap = vault.functions.maxDeposit(my_address).call()
    if deposit_amount > deposit_cap:
        print(f"Deposit exceeds vault cap ({deposit_cap}). Skipping deposit.")
        return

    if usdc_balance >= deposit_amount:
        # Approve once with max allowance — avoids a separate approve tx on every deposit.
        # Replace 2**256 - 1 with deposit_amount if you prefer exact-amount approvals.
        allowance = usdc.functions.allowance(my_address, VAULT_ADDRESS).call()
        if allowance < deposit_amount:
            print("Approving USDC (max allowance)...")
            approve_tx = usdc.functions.approve(
                VAULT_ADDRESS, 2**256 - 1
            ).build_transaction(build_tx_params(w3, my_address))
            approve_tx["gas"] = w3.eth.estimate_gas(approve_tx)
            signed = w3.eth.account.sign_transaction(approve_tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)  # web3.py v7+
            w3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"Approved: {tx_hash.hex()}")

        # Slippage check before sending the deposit
        expected_shares = vault.functions.previewDeposit(deposit_amount).call()
        min_shares      = (expected_shares * 995) // 1000  # 0.5% slippage floor

        print("Depositing 100 USDC into AI Hedge vault...")
        deposit_tx = vault.functions.deposit(
            deposit_amount, my_address
        ).build_transaction(build_tx_params(w3, my_address))
        deposit_tx["gas"] = w3.eth.estimate_gas(deposit_tx)
        signed_deposit = w3.eth.account.sign_transaction(deposit_tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_deposit.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Deposit confirmed in tx: {receipt.transactionHash.hex()}")

        # Verify slippage after deposit
        new_shares = vault.functions.balanceOf(my_address).call()
        received   = new_shares - share_balance
        if received < min_shares:
            raise RuntimeError(f"Slippage exceeded: got {received}, minimum was {min_shares}")
        print(f"Received {received / 1e6:.6f} shares (min was {min_shares / 1e6:.6f})")
    else:
        print("Insufficient USDC balance. Skipping deposit.")


if __name__ == "__main__":
    main()
```

:::info[Web3.py Version Note]
`signed_tx.raw_transaction` is the correct attribute in **web3.py v7+**. If you are using web3.py v6, use `signed_tx.rawTransaction` (camelCase).
:::
