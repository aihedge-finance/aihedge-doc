---
title: Finding Your Wallet Secret & Private Key
sidebar_position: 5
---

# Finding Your Wallet Secret & Private Key

When creating autonomous AI agents, automated Python bots, or developer scripts that execute transactions on AI Hedge vaults, your script requires a **Private Key (Secret Key)** to sign transactions on-chain.

This guide explains what a private key is, how to locate it across major Web3 wallets, and crucial security rules to keep your funds safe.

:::danger[Critical Wallet Security & Liability Disclaimer]
* **Never share your seed phrase or private key with anyone.**
* **Never paste raw private keys or seed phrases into public AI chat interfaces** (such as public ChatGPT, Claude web, Discord bots, or unencrypted web prompts).
* **AI Hedge is 100% non-custodial** and has no access to your wallet secrets. AI Hedge and its contributors assume **no responsibility or liability for any loss of funds** resulting from compromised, leaked, or stolen private keys.
:::

---

## 🛡️ Best Practice: Use a Dedicated "Agent Wallet"

Before exporting or using any private key in automated scripts:

1. **Do NOT use your primary personal or savings wallet.**
2. **Create a fresh, dedicated sub-wallet** in your wallet app specifically for your AI agent or bot.
3. **Fund it only with the exact amount** of USDC and gas required for the agent's operations.
4. If the agent's environment or machine is ever compromised, your main assets remain completely insulated.

---

## 🔑 How to Export Private Keys by Wallet

A private key is a **64-character hexadecimal string** (often prefixed with `0x`). Here are the exact steps and search terms to locate your key in popular wallets:

### 1. MetaMask (Browser Extension & Mobile)
* **Search Keywords**: *MetaMask export private key*, *MetaMask account details show private key*
* **Step-by-Step**:
  1. Open MetaMask and select the specific account you want to use.
  2. Click the **three dots menu (⋮)** in the top-right corner $\rightarrow$ click **Account details**.
  3. Click **Show Private Key**.
  4. Enter your MetaMask password and click **Confirm**.
  5. Hold down the reveal button to view and copy your private key.
* **Official Guide**: [MetaMask Support: How to export an account's private key](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/)

---

### 2. Rabby Wallet (Browser Extension & Desktop)
* **Search Keywords**: *Rabby backup private key*, *Rabby export address key*
* **Step-by-Step**:
  1. Open Rabby Wallet and click on your address at the top to open **Manage Address**.
  2. Click the **three dots (···)** next to the target sub-account.
  3. Click **Backup Private Key**.
  4. Enter your Rabby unlock password to view and copy the key.
* **Official Help**: [Rabby Wallet Official Site](https://rabby.io/)

---

### 3. Coinbase Wallet (Extension & Mobile App)
* **Search Keywords**: *Coinbase wallet export private key*, *Coinbase wallet show private key*
* **Step-by-Step**:
  1. Open Coinbase Wallet and navigate to **Settings** (gear icon).
  2. Select **Security & Privacy** (or **Developer Settings** in extension).
  3. Tap **Show Private Key** or select the specific address.
  4. Authenticate with your passcode, biometric, or password to view the key.
* **Official Guide**: [Coinbase Wallet Support](https://help.coinbase.com/en/wallet)

---

### 4. OKX Wallet (Extension & Mobile)
* **Search Keywords**: *OKX wallet export private key*, *OKX account management private key*
* **Step-by-Step**:
  1. Open OKX Wallet and click the account/profile icon in the top-left.
  2. Click **Manage** (or Account Management).
  3. Click the three dots next to your target account $\rightarrow$ select **Export Private Key**.
  4. Enter your wallet password to copy the private key string.
* **Official Guide**: [OKX Help Center](https://www.okx.com/help)

---

### 5. Trust Wallet (Mobile App & Extension)
* **Search Keywords**: *Trust wallet export private key*, *Trust wallet show secret phrase*
* **Step-by-Step**:
  1. Open Trust Wallet and go to **Settings** $\rightarrow$ **Wallets**.
  2. Tap the **info icon (ℹ️)** or three dots next to the active wallet.
  3. Select **Export Private Key** (or View Secret Phrase for the parent key).
  4. Confirm your passcode to reveal.
* **Official Guide**: [Trust Wallet Support](https://community.trustwallet.com/)

---

### 6. Rainbow Wallet
* **Search Keywords**: *Rainbow wallet export private key*, *Rainbow view secret recovery phrase*
* **Step-by-Step**:
  1. Open Rainbow and tap **Settings** (gear icon).
  2. Select **Wallets & Keys** (or Backup).
  3. Select the target address $\rightarrow$ tap **View Private Key**.
  4. Authenticate with your device passcode or password.
* **Official Guide**: [Rainbow Support](https://rainbow.me/support)

---

### 7. Phantom Wallet (Ethereum / Base Multi-Chain)
* **Search Keywords**: *Phantom export private key Ethereum*, *Phantom security export key*
* **Step-by-Step**:
  1. Open Phantom and go to **Settings** $\rightarrow$ **Security & Privacy**.
  2. Click **Export Private Key**.
  3. Select your Ethereum / Base account and enter your password to reveal.
* **Official Guide**: [Phantom Help Center](https://help.phantom.app/)

---

## 🔍 Finding Keys in Other Wallets

If you are using a different Web3 wallet (such as Brave Wallet, Zerion, Bitget, Frame, or TokenPocket), search on Google or your wallet's official support documentation using these search query patterns:

```text
"[Your Wallet Name] export private key"
"[Your Wallet Name] show private key for account"
"[Your Wallet Name] developer export secret key"
```

---

## 🔒 Storing Your Key Securely in Scripts (`.env`)

When running agent scripts locally (e.g. from the [Python Guide](../developers/python-guide) or [TypeScript Guide](../developers/typescript-guide)):

1. Create a local configuration file named `.env` in your project folder:
   ```bash
   RPC_URL=https://mainnet.base.org
   PRIVATE_KEY=0xYourExportedPrivateKeyHere
   ```
2. **Always include `.env` in your `.gitignore` file** to ensure it is never uploaded to GitHub or public repositories:
   ```bash
   # .gitignore
   .env
   *.key
   .secrets
   ```
