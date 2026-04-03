# HashKey Chain Technical Overview

## Overview

HashKey Chain is an OP Stack-based Ethereum Layer 2 optimistic rollup operated by HashKey Group, a Hong Kong SFC-licensed financial institution. It is a member of the Optimism Superchain. HashKey Chain is the first regulated blockchain operated by an entity holding both Type 1 (Dealing in Securities) and Type 7 (Automated Trading Services) licenses from the Hong Kong Securities and Futures Commission.

## Architecture

| Component | Detail |
|-----------|--------|
| Stack | OP Stack (Optimism) |
| VM | EVM-compatible |
| Data Availability | Ethereum L1 (blobs/calldata via EIP-4844) |
| State Validation | Fraud proofs (interactive, Optimism Fault Proof / OPFP) |
| Challenge Period | 7 days (302,400 seconds) |
| Sequencer | Centralized single sequencer |
| Force Transaction Delay | Up to 12 hours |
| Superchain Status | Stage 0 |
| Throughput | ~22,929 gas/s; tested up to 400 TPS |

## Network Configuration

### Mainnet

| Parameter | Value |
|-----------|-------|
| Chain ID | 177 (0xb1) |
| Native Currency | HSK (18 decimals) |
| RPC HTTP | `https://mainnet.hsk.xyz` |
| RPC (dRPC) | `https://hashkey.drpc.org` |
| WebSocket (dRPC) | `wss://hashkey.drpc.org` |
| Block Explorer | `https://hashkey.blockscout.com` |
| Bridge | `https://bridge.hashkeychain.net` |
| Safe (Multisig) | `https://multisig.hashkeychain.net/welcome?chain=HSK` |
| RPC Rate Limit | 300 calls/minute (public endpoint) |
| Block Time | ~2 seconds |

### Testnet

| Parameter | Value |
|-----------|-------|
| Chain ID | 133 |
| Native Currency | HSK (18 decimals) |
| RPC HTTP | `https://testnet.hsk.xyz` |
| Block Explorer | `https://testnet-explorer.hsk.xyz` |
| Bridge | `https://testnet-bridge.hashkeychain.net/` |
| Faucet | `https://faucet.hsk.xyz/faucet` |

**Note:** Chain ID 230315 is a deprecated testnet. Do not use it.

## HSK Token

- **Name:** HashKey EcoPoints (HSK)
- **Decimals:** 18
- **Total Supply:** 1,000,000,000 (1 billion) fixed
- **Utility:** Native gas token for all transactions on HashKey Chain
- **Burn Mechanism:** Quarterly buyback-and-burn using 20% of net protocol profits

Unlike most OP Stack chains that use ETH as the native gas token, HashKey Chain uses HSK. This means:
- All gas fees are paid in HSK.
- `msg.value` is denominated in HSK, not ETH.
- Tooling that assumes ETH as the native currency may require configuration adjustments.

## Fee Structure

HashKey Chain uses a dual-fee model consistent with all OP Stack chains:

**Total Fee = L2 Execution Fee + L1 Data Fee**

1. **L2 Execution Fee:** Covers computational resources for transaction execution. Based on EIP-1559 gas model. Generally much lower than Ethereum mainnet.
2. **L1 Security Fee (Data Fee):** Cost of posting transaction data to Ethereum mainnet. Fluctuates with Ethereum gas prices. Often the larger portion of total cost. Benefits from EIP-4844 blobs.

## Key Smart Contracts

### L1 Contracts (Ethereum Mainnet)

| Contract | Address |
|----------|---------|
| OptimismPortal2 | `0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3` |
| DisputeGameFactory | `0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50` |
| SystemConfig | `0x43F8DeFe3E9286D152E91BB16a248808E7247198` |
| L1StandardBridge | `0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be` |

### L2 Predeploys

| Contract | Address |
|----------|---------|
| EAS (Ethereum Attestation Service) | `0x4200000000000000000000000000000000000021` |
| SchemaRegistry (EAS) | `0x4200000000000000000000000000000000000020` |
| L1Block | `0x4200000000000000000000000000000000000015` |

### Oracle Contracts (Mainnet)

| Oracle | Contract Address |
|--------|-----------------|
| SUPRA Pull | `0x16f70cAD28dd621b0072B5A8a8c392970E87C3dD` |
| SUPRA Storage | `0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57` |
| APRO BTC/USD | `0x204ED500ab56A2E19B051561258E3A45c850360F` |
| APRO HSK/USD | `0x86CE42c1b714149Dc3A7b169EF67b5F78A224b` |
| APRO USDT/USD | `0x823d7f90f7A3498DB6595886b6B5dC95E6B0B7f3` |
| APRO USDC/USD | `0x244Ce344df8837c9d938867E2Ffbf0E4B0169B56` |
| Chainlink Verifier | `0x3278e7a582B94d82487d4B99b31A511CbAe2Cd54` |

## Governance

Governance is managed through L1 multisigs:

| Multisig | Threshold | Role |
|----------|-----------|------|
| Hashkey Multisig 1 | 3/5 | Instant contract upgrades (no time delay) |
| Hashkey Multisig 2 | 3/5 | Guardian (pause authority) |
| Hashkey Multisig 3 | 3/5 | System configuration updates |

**Important:** The 3/5 multisig can upgrade contracts instantly with no time delay. There is no exit window for users before unwanted upgrades.

## Unique Features

### 1. KYC Soul-Bound Token (SBT) System
HashKey Chain provides a native on-chain KYC verification system through Soul-Bound Tokens. This allows smart contracts to verify user identity without accessing personal data. See `kyc_sbt_docs.md` for full documentation.

### 2. Ethereum Attestation Service (EAS)
EAS is available as a predeploy at `0x4200000000000000000000000000000000000021`, enabling on-chain attestations for compliance certificates, audit results, and identity verification.

### 3. Regulatory-Compliant Infrastructure
Operated by an SFC-licensed entity, HashKey Chain is designed for compliant DeFi and tokenized asset applications, making it suitable for institutional and regulated use cases.

## Development Tooling

### Foundry

```toml
# foundry.toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
hashkeyTestnet = "https://testnet.hsk.xyz"
hashkeyMainnet = "https://mainnet.hsk.xyz"
```

### Hardhat

```typescript
// hardhat.config.ts
networks: {
  hashkeyTestnet: {
    url: "https://testnet.hsk.xyz",
    chainId: 133,
  },
  hashkeyMainnet: {
    url: "https://mainnet.hsk.xyz",
    chainId: 177,
  },
}
```

### Frontend (viem/wagmi)

```typescript
import { hashkey, hashkeyTestnet } from "viem/chains";
```

HashKey Chain is natively supported in viem and wagmi chain definitions.

## Supported Wallets

- OKX Wallet
- MetaMask
- TokenPocket
- ImToken

## Ecosystem Partners

- **Exchanges:** OKX, Gate.io
- **DeFi:** DODO, Solv Protocol, Puffer.fi, StakeStone
- **Cross-chain:** Orbiter Finance, Owolto Finance
- **Infrastructure:** Particle Network, OneKey, dRPC

## Source

HashKey Chain Documentation. Available at https://docs.hashkeychain.net. L2BEAT HashKey Chain Profile. Available at https://l2beat.com/scaling/projects/hashkey.
