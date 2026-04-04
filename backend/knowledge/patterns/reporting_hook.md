# Regulatory Reporting Event Emission Pattern

## Problem

Regulated protocols must maintain detailed records of all significant operations for regulatory reporting, audit trails, and suspicious transaction monitoring. Off-chain compliance systems need structured data from on-chain events to generate reports for regulators (e.g., STRs to JFIU, Travel Rule data transmissions).

## Solution

Define and emit comprehensive, structured events at every state-changing operation that is relevant to compliance. These events serve as the bridge between on-chain activity and off-chain compliance infrastructure.

### Reporting Hook Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract ComplianceReporting {
    // Core compliance events
    event ComplianceTransfer(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        address token,
        uint256 timestamp
    );

    event ComplianceDeposit(
        bytes32 indexed depositId,
        address indexed depositor,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    event ComplianceWithdrawal(
        bytes32 indexed withdrawalId,
        address indexed withdrawer,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    event SuspiciousActivity(
        bytes32 indexed activityId,
        address indexed account,
        string reason,
        uint256 amount,
        uint256 timestamp
    );

    event TravelRuleData(
        bytes32 indexed transferId,
        bytes32 originatorDataHash,
        bytes32 beneficiaryDataHash,
        uint256 amount,
        uint256 timestamp
    );

    event ComplianceStatusChanged(
        address indexed account,
        uint8 oldStatus,
        uint8 newStatus,
        string reason,
        uint256 timestamp
    );

    event LargeTransactionAlert(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 threshold,
        uint256 timestamp
    );

    uint256 private _transferNonce;

    function _generateTransferId() internal returns (bytes32) {
        unchecked { _transferNonce++; }
        return keccak256(
            abi.encode(block.chainid, address(this), _transferNonce, block.timestamp)
        );
    }

    function _emitComplianceTransfer(
        address from,
        address to,
        uint256 amount,
        address token,
        uint256 threshold
    ) internal returns (bytes32 transferId) {
        transferId = _generateTransferId();

        emit ComplianceTransfer(
            transferId, from, to, amount, token, block.timestamp
        );

        if (amount >= threshold) {
            emit LargeTransactionAlert(
                transferId, from, to, amount, threshold, block.timestamp
            );
        }
    }

    function _emitTravelRuleData(
        bytes32 transferId,
        bytes32 originatorHash,
        bytes32 beneficiaryHash,
        uint256 amount
    ) internal {
        emit TravelRuleData(
            transferId, originatorHash, beneficiaryHash, amount, block.timestamp
        );
    }
}
```

### Usage

```solidity
contract CompliantToken is ERC20, KYCGated, ComplianceReporting {
    uint256 public constant REPORTING_THRESHOLD = 8000e18;

    function transfer(address to, uint256 amount) public override onlyVerifiedHuman returns (bool) {
        bytes32 transferId = _emitComplianceTransfer(
            msg.sender, to, amount, address(this), REPORTING_THRESHOLD
        );

        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount)
        public override onlyVerifiedHuman returns (bool)
    {
        bytes32 transferId = _emitComplianceTransfer(
            from, to, amount, address(this), REPORTING_THRESHOLD
        );

        return super.transferFrom(from, to, amount);
    }
}
```

### Off-Chain Event Listener (TypeScript/viem)

```typescript
import { createPublicClient, http, parseAbiItem } from "viem";
import { hashkey } from "viem/chains";

const client = createPublicClient({
  chain: hashkey,
  transport: http("https://mainnet.hsk.xyz"),
});

// Watch for large transaction alerts
const unwatch = client.watchEvent({
  address: contractAddress,
  event: parseAbiItem(
    "event LargeTransactionAlert(bytes32 indexed transferId, address indexed from, address indexed to, uint256 amount, uint256 threshold, uint256 timestamp)"
  ),
  onLogs: (logs) => {
    for (const log of logs) {
      // Trigger compliance review workflow
      handleLargeTransaction(log.args);
    }
  },
});
```

## Event Design Principles

1. **Indexed Fields:** Index fields that will be queried frequently (addresses, IDs) for efficient log filtering. Maximum 3 indexed fields per event.
2. **Unique IDs:** Generate unique transfer/operation IDs to correlate on-chain events with off-chain records.
3. **Timestamps:** Include `block.timestamp` in events for time-based queries and regulatory reporting windows.
4. **Separation of Concerns:** Use distinct event types for different operations (transfer, deposit, withdrawal, suspicious activity) rather than a single generic event.
5. **Data Hashing:** For Travel Rule data, emit hashes of personal data (not the data itself) to maintain privacy while enabling verification.

## When to Use

- On every function that moves value (transfers, deposits, withdrawals, swaps).
- When the protocol needs to support STR filing with JFIU or other FIUs.
- When Travel Rule compliance requires pairing on-chain transfers with off-chain data.
- When audit trails are required for regulatory inspections.

## Related Regulations

| Regulation | Reporting Requirement |
|------------|----------------------|
| Hong Kong AMLO Section 25 | STR filing with JFIU |
| FATF Recommendation 20 | Reporting of suspicious transactions |
| FATF Recommendation 16 | Travel Rule data transmission |
| SFC VATP Guidelines | Market surveillance and transaction monitoring |
| EU MiCA Article 76 | Detection and reporting of market abuse |

## HashKey Chain Specific Considerations

1. **Low Event Costs:** Emitting events on HashKey Chain is inexpensive due to low L2 execution fees, so comprehensive event emission does not significantly impact gas costs.
2. **Block Explorer Integration:** Events emitted on HashKey Chain are indexed by Blockscout at `hashkey.blockscout.com`, enabling compliance teams to review on-chain activity through the explorer.
3. **EAS Complement:** For critical compliance events (e.g., completed audits, compliance certifications), consider creating EAS attestations in addition to events. Events are ephemeral in the sense that they are not directly queryable from smart contracts; attestations provide persistent on-chain records.
4. **Subgraph Integration:** Use The Graph (network ID: `hashkeychain`) to index compliance events for efficient querying by off-chain monitoring systems.

## Source

FATF Recommendations 16 and 20. Hong Kong AMLO reporting requirements. CompliBot compliance patterns.
