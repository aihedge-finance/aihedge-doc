# Protocol Terminology & Documentation Rules

Guidelines and standards for documentation, terminology, and glossary maintenance across AI Hedge.

---

## 1. Vault Standards & Brand Restrictions
- **Zero Mentions of Yearn**: Never mention "Yearn", "Yearn Finance", or "Yearn V3" in documentation, UI copy, diagrams, or explanatory text.
- **Use ERC-4626**: Always refer to vault architecture using the **ERC-4626 Tokenized Vault standard**, **multi-strategy yield vaults**, or **modular vault allocator** terminology.

---

## 2. Continuous Glossary Maintenance
- **Automatic Glossary Updates**: Whenever a new technical term, financial metric, protocol mechanism, or vault concept is introduced (e.g., Price Per Share / PPS, FWD. APY, 30D APY, Instantaneous APY, Slippage Tolerance, Vault Shares, Report / Harvest Cycles), you **MUST** immediately add its clear definition to the **Simple Glossary** in [`docs/live-features/yield-vaults/deposit-withdraw.md`](file:///Users/jonathan/MyCode/AIHedge/aihedge-doc/docs/live-features/yield-vaults/deposit-withdraw.md) and related metrics reference tables.
- **Simple, Accessible Language**: Glossary definitions must be formulated in simple, intuitive terms understandable by non-technical DeFi users while retaining mathematical precision.

---

## 3. Brand Identity & Naming
- Always format the brand name as **AI Hedge** (with a space) in all user-facing copy, document headings, titles, and explanations.
- Retain technical repository slugs, URL domains (`aihedge.finance`), CSS variable names (`--aihedge-teal`), and token tickers (`AIHEDGE`).
