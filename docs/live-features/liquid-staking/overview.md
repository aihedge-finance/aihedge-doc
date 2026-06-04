---
title: Liquid Staking Overview
sidebar_position: 1
---

# Liquid Staking Overview

AIHedge integrates with leading Ethereum liquid staking protocols to let you earn ETH staking rewards without locking your ETH or running a validator node. You remain in full control of your assets at all times.

![Liquid Staking Section](/img/dapp/liquid_staking_landing_1780574852601.png)

---

## What is Liquid Staking?

When you stake ETH natively on Ethereum, your ETH is locked until withdrawals are processed. **Liquid staking** solves this by:

1. Accepting your ETH deposit
2. Staking it on your behalf with a validator network
3. Returning a **liquid staking token (LST)** (e.g. `weETH`, `stETH`) to your wallet

The LST represents your staked ETH position and accrues staking rewards over time. You can hold it, trade it, or use it in other DeFi protocols — it remains liquid.

---

## Supported Protocols

AIHedge currently integrates with:

| Protocol | LST Token | Description |
|---|---|---|
| **Ether.fi** | `weETH` | Non-custodial delegated staking with restaking yield via EigenLayer |
| **Lido** | `stETH` / `wstETH` | The largest Ethereum liquid staking protocol by TVL |

![Available Liquid Staking Protocols](/img/dapp/liquid_staking_landing_1780574852601.png)

---

## Why Use AIHedge for Liquid Staking?

- **Unified interface** — access multiple staking protocols from one dashboard
- **Optimized routing** — AIHedge routes to the best available yield across supported protocols
- **Self-custody** — your LST tokens remain in your wallet; AIHedge never holds your assets
- **Composability** — your LST can be deposited into AIHedge yield vaults for additional compounding yield on top of staking rewards

---

## Risks to Understand

- **Slashing risk** — if a validator misbehaves, a small portion of staked ETH may be slashed. This risk is managed by the underlying protocol (Ether.fi, Lido).
- **Smart contract risk** — liquid staking involves multiple smart contracts; always review the protocol's audit reports.
- **LST depeg risk** — LSTs can trade at a slight discount to ETH in secondary markets during high redemption demand.
