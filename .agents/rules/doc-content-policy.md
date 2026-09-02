# AI Hedge Documentation Content Policy

Rules that apply whenever writing, editing, or reviewing any documentation under `/Users/jonathan/MyCode/AIHedge/aihedge-doc/`.

---

## 1. No Underlying Strategy Exposure

- **Never** disclose the addresses, names, or on-chain identities of strategies that sit beneath an AI Hedge vault.
- **Only** the top-level vault contract address is permitted in documentation (e.g., `0x100f0ac3be2c93c76b2ee1b8ca98d8928cdc0871` on Base).
- Do not enumerate the strategy queue, individual protocol allocations (Morpho, Curve, Aerodrome sub-pools, etc.), or any strategy-level contract addresses.

## 2. No Trading, Strategy Logic, or Risk Prevention Details

- Do not describe the allocation engine, rebalancing logic, debt management, TWAP execution, or keeper mechanics.
- Do not describe risk controls, circuit-breakers, slippage guardrails internal to the vault strategy layer, or PPS anomaly detection logic.
- Documentation should be limited to the **depositor/integrator interface**: deposit, redeem, preview functions, and NAV queries on the vault itself.

## 3. Never Mention Yearn

- Do not reference Yearn, Yearn V3, Yearn Finance, or any Yearn-branded contracts, interfaces (`IYearnV3Vault`), or tooling.
- The vaults are AI Hedge ERC-4626 vaults. Refer to them only as such.
- Interface names must use `IERC4626Vault`, `IAIHedgeVault`, or `IAIHedgeYieldVault` — never `IYearnV3Vault`.

---

## Summary of Permitted vs. Prohibited Content

| Permitted ✅ | Prohibited ❌ |
|---|---|
| Vault contract address | Strategy contract addresses |
| ERC-4626 public functions (`deposit`, `redeem`, `previewDeposit`, etc.) | Internal allocation mechanics |
| `convertToAssets()` for PPS computation | Yearn, IYearnV3, Yearn V3 |
| NAV / TVL via `totalAssets()` | Strategy names or protocol sub-allocations |
| Slippage checks on deposit/redeem | Risk engine, circuit-breaker, or TWAP logic |
| Vault share accounting | Keeper, debt management, rebalancer details |
