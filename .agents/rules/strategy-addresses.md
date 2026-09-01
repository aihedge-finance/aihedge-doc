# Strategy Smart Contract Address Privacy

Guidelines and security restrictions regarding the confidentiality of strategy smart contract addresses across AI Hedge documentation, UI, and repositories.

---

## 1. Strict Non-Exposure of Strategy Addresses
- **Zero Strategy Address Leakage**: Never expose, publish, or hardcode the exact smart contract addresses of underlying yield strategies or strategy adaptors in public documentation, markdown files, public repositories, blog posts, diagrams, or UI components.
- **Scope of Protection**: This applies to all deployed strategy implementations, adapter contracts, rebalancing contracts, and execution wrappers managing underlying capital (e.g., Morpho, Curve, Compound, Aave strategy contracts).

---

## 2. Allowed vs. Prohibited Contract Disclosures
- **Public & Allowed**:
  - ERC-4626 Vault contract addresses (e.g., `USDC AI Hedge Multi-Strategy Vault`).
  - Underlying asset token addresses (e.g., native/bridged `USDC`, `USDT`, `ETH`).
  - Public factory or governance registry contracts explicitly designated for public interaction.
- **Strictly Prohibited**:
  - Live strategy contract addresses (`0x...`).
  - Direct block explorer links targeting specific strategy contract addresses.
  - Deployed allocator execution script contracts or private yield routing contracts.

---

## 3. Approved Documentation & Presentation Patterns
- **Abstract Representation in Registries**: In contract tables or registries (such as `contract-addresses.md`), list strategies using descriptive names with masked or generic status designations (e.g., `On-Chain Verified Strategy` or generic explorer links) rather than raw hex addresses or direct strategy explorer links.
- **Code Examples & Integration Guides**: When providing integration snippets, API guides, or architectural diagrams, use abstract labels or generic dummy placeholders (e.g., `0x000...` or vault-level references only).
