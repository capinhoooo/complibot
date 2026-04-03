# HashKey Chain: Differences from Standard EVM

## Overview

HashKey Chain is fully EVM-compatible via the OP Stack, meaning standard Solidity contracts and Ethereum tooling work without modification. However, there are important behavioral differences that developers must be aware of when building on HashKey Chain.

## Native Token: HSK (Not ETH)

The most significant difference from most OP Stack chains and Ethereum is that HashKey Chain uses HSK (HashKey EcoPoints) as its native gas token instead of ETH.

### Implications

1. **Gas Payments:** All gas fees are paid in HSK, not ETH.
2. **msg.value:** When a function receives native currency via `msg.value`, it is denominated in HSK (18 decimals).
3. **address.balance:** Returns the HSK balance, not ETH.
4. **payable functions:** Accept HSK, not ETH.
5. **Tooling Configuration:** Tools that assume ETH as the native token (e.g., Hardhat gas reporters, block explorers) need configuration. Make sure your `nativeCurrency` definition uses `{ name: "HashKey EcoPoints", symbol: "HSK", decimals: 18 }`.

### Code Considerations

```solidity
// This receives HSK, not ETH
receive() external payable {
    // msg.value is in HSK
}

// This sends HSK, not ETH
function withdrawNative(uint256 amount) external {
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "HSK transfer failed");
}
```

## Opcode Differences (Inherited from OP Stack)

| Opcode | Ethereum Behavior | HashKey Chain Behavior |
|--------|-------------------|----------------------|
| `COINBASE` | Returns the block miner/proposer address | Returns the Sequencer's fee wallet address (constant across blocks) |
| `PREVRANDAO` | Returns beacon chain randomness | Returns the `PREVRANDAO` of L1 at the current L1 origin block, NOT L2-specific randomness |
| `ORIGIN` / `CALLER` | Standard sender address | For L1-to-L2 deposit transactions from contracts, addresses are aliased by adding `0x1111000000000000000000000000000000001111` |

### Security Implications

- **Do NOT use `COINBASE` for identifying miners/validators.** It is a static address on HashKey Chain.
- **Do NOT use `PREVRANDAO` as a source of randomness on L2.** It reflects L1 state and is predictable on the L2 side. Use a dedicated randomness oracle (e.g., Chainlink VRF) if you need randomness.
- **Address aliasing:** If your contract receives L1-to-L2 messages from another contract, the `msg.sender` will be the original sender address plus the alias offset. Account for this in any access control logic that handles cross-layer messages.

## Block Time and Finality

| Feature | Ethereum | HashKey Chain |
|---------|----------|---------------|
| Block Time | ~12 seconds | ~2 seconds |
| Finality Model | Single finality | Three states: Unsafe, Safe, Finalized |
| Time to Finality | ~12 minutes (1 epoch) | Unsafe: immediate; Safe: ~minutes; Finalized: ~7 days |

### Finality States

1. **Unsafe:** Block has been produced by the Sequencer but not yet submitted to L1. Fast but not guaranteed.
2. **Safe:** Block data has been submitted to L1. Unlikely to be reverted but theoretically possible during fraud proof challenge.
3. **Finalized:** Challenge period has passed. The block is immutably settled on L1.

### Code Considerations

- `block.timestamp` on L2 may advance differently than expected. Do not assume a fixed block time.
- For time-sensitive logic (e.g., auctions, deadlines), be aware that L2 timestamps are set by the Sequencer.

## No Public Mempool

HashKey Chain's mempool is private to the Sequencer. This means:
- **No MEV:** Frontrunning and sandwich attacks are not possible through the standard mempool. However, the centralized sequencer could theoretically reorder transactions.
- **No Mempool Monitoring:** Tools that monitor pending transactions (e.g., for arbitrage bots) will not work.
- **Transaction Ordering:** Determined solely by the Sequencer. Generally FIFO but not guaranteed.

## Fee Model Differences

### Dual Fee Structure

Unlike Ethereum's single gas fee, HashKey Chain has two fee components:

```
Total Cost = L2 Execution Fee + L1 Data Fee
```

- **L2 Execution Fee:** Similar to Ethereum's gas model (base fee + priority fee). Predictable and low.
- **L1 Data Fee:** Cost of posting transaction data to Ethereum L1. This can be volatile based on Ethereum mainnet gas prices.

### Gas Estimation

When estimating gas, account for both components. The L1 data fee depends on the size of the transaction data (calldata), not just the computational gas used. Transactions with large calldata will have proportionally higher L1 data fees.

```typescript
// In viem, the gas estimate includes both L2 execution and L1 data fee
const gasEstimate = await client.estimateGas({
  to: contractAddress,
  data: encodedFunctionData,
});
```

## Withdrawal Process (L2 to L1)

Unlike instant L1-to-L2 deposits, withdrawing from HashKey Chain to Ethereum requires a multi-step process:

1. **Initiate Withdrawal** on L2 (immediate).
2. **Wait for State Root** to be posted to L1 (~3.5 days).
3. **Prove Withdrawal** on L1 with Merkle proof.
4. **Wait Challenge Period** (~3.5 days additional).
5. **Finalize Withdrawal** on L1.

**Total time: approximately 7 days.**

This means UX for withdrawals must account for the delay. For applications that require faster exits, consider using third-party bridges like Orbiter Finance.

## KYC Requirement

HashKey Chain's unique feature is the native KYC SBT system. While not required at the protocol level for basic transactions, compliant dApps should integrate KYC verification:

- Use the `IHashKeyKYC` interface to check user verification status.
- Apply `onlyVerifiedHuman` modifiers to functions that handle user funds.
- Consider tiered access based on KYC level for different risk profiles.

## Precompiles

All standard Ethereum precompiles (ecrecover, sha256, ripemd160, identity, modexp, ecadd, ecmul, ecpairing, blake2f) are available.

OP Stack adds:
- **L1Block** at `0x4200000000000000000000000000000000000015`: Provides L1 state information (block number, timestamp, base fee, hash, sequence number).

## Supported Token Standards

- ERC-20 (fungible tokens)
- ERC-721 (non-fungible tokens)
- ERC-1155 (multi-token standard)

All standard OpenZeppelin implementations work without modification.

## RPC Rate Limiting

The public RPC endpoint (`mainnet.hsk.xyz`) is rate-limited to 300 calls/minute. For production applications:
- Use dRPC (`hashkey.drpc.org`) for higher throughput.
- Consider running your own node (minimum 16 GB RAM, 4 CPU cores, 500 GB SSD).

## Common Gotchas

1. **HSK, not ETH:** The number one mistake. Check all code that references "ETH" or assumes ETH as native.
2. **L1 Data Fee Spikes:** Budget for L1 fee volatility, especially for time-sensitive transactions.
3. **2-Second Blocks:** Timestamp-based logic may behave differently with faster blocks.
4. **Limited Oracle Feeds:** Only BTC, HSK, USDT, and USDC price feeds are available. No ETH/USD feed.
5. **Centralized Sequencer:** Single point of failure. Users can bypass via L1 force-inclusion (up to 12-hour delay).

## Source

HashKey Chain Documentation. Available at https://docs.hashkeychain.net. Optimism Documentation for OP Stack differences. Available at https://docs.optimism.io/chain/differences.
