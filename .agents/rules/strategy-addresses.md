# Strategy Confidentiality & Supplier Non-Exposure Rule

Guidelines and business restrictions regarding the confidentiality of strategy smart contract addresses, underlying protocol suppliers, and strategy types across AI Hedge documentation, UI, architectural charts, and public repositories.

---

## 1. Business Rationale & Policy

1. **Frequent Dynamic Rebalancing**: Underlying yield strategies, adapters, and liquidity venues change frequently as the AI allocation engine dynamically rotates capital based on real-time yields, risk regimes, and gas efficiency. Documenting specific suppliers or strategy categories quickly becomes stale and inaccurate.
2. **Commercial & Competitive Protection**: Publicly disclosing specific third-party protocol suppliers, venue routing weights, or detailed strategy types is disadvantageous from a business, intellectual property, and competitive standpoint.
3. **User Perspective**: End users and developers do not need to know internal strategy mechanics or strategy types—they interact strictly with the standard ERC-4626 vault interface.

---

## 2. Strict Prohibition on Supplier & Strategy Content Disclosures

- **No Strategy Content / Type Enumeration**: Do NOT list out or enumerate internal strategy types, categories, or specific mechanics in architectural charts or public documentation. Users do not need to know the specific types of strategies running behind the vault.
- **No Public Supplier Disclosures**: Do NOT name, list, or advertise specific third-party protocol suppliers or venues (e.g. specific lending or DEX protocols) in the "Underlying Multi-Strategy Queue" of architectural charts, product descriptions, or registries.
- **Zero Strategy Address Exposure**: NEVER expose, publish, or hardcode the exact smart contract addresses (`0x...`) of underlying yield strategies or strategy adapters in public documentation, markdown files, public repositories, blog posts, diagrams, or UI components.
- **No Direct Strategy Explorer Links**: Do not link directly to block explorer pages of internal sub-strategy contracts.

---

## 3. Allowed vs. Prohibited Content

| Content Item | Policy | Approved Representation |
| :--- | :--- | :--- |
| **ERC-4626 Vault Contracts** | ✅ **Allowed** | Publicly list official vault addresses (e.g. `USDC AI Hedge Multi-Strategy Vault`). |
| **Underlying Asset Tokens** | ✅ **Allowed** | Publicly list native/bridged token addresses (e.g. `USDC`, `USDT`, `ETH`). |
| **Underlying Strategies in Charts** | 🔒 **Abstract Only** | Simply write `Strategies` (e.g. `Strategy 1`, `Strategy 2`, `Strategy 3`, `Strategy N`). Do not list out content or strategy types. |
| **Strategy Types & Categories** | 🚫 **Prohibited** | Do not enumerate specific strategy classifications (e.g., lending, CL, arbitrage) in architectural charts. |
| **Sub-Strategy Contract Addresses** | 🚫 **Strictly Prohibited** | Never list internal strategy contract hex addresses (`0x...`). |
| **Specific Supplier Protocol Names** | 🚫 **Strictly Prohibited** | Do not specify individual underlying third-party suppliers anywhere in public docs or charts. |

---

## 4. Architectural Chart & Diagram Standards

In all Mermaid diagrams, sequence flows, and system architecture charts:
- Label the strategy subgraph simply as **`Strategies`** (or `Underlying Strategies`).
- Inside the subgraph, list generic numbered nodes: `Strategy 1`, `Strategy 2`, `Strategy 3`, `Strategy N`.
- **Do NOT list out what the strategies do or their types.** Keep it completely abstract and clean.


