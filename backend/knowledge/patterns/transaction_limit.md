# Transaction Limit Pattern (FATF Travel Rule Compliance)

## Problem

Regulatory frameworks including the FATF Travel Rule (Recommendation 16) and Hong Kong AMLO require different compliance actions based on transaction amounts. Transactions above certain thresholds (e.g., HKD 8,000 / USD 1,000) trigger additional data collection and reporting requirements. Smart contracts need to enforce per-transaction and aggregate limits to support these regulatory obligations.

## Solution

Implement per-transaction limits and daily aggregate limits with configurable thresholds. Emit structured events that enable off-chain systems to apply Travel Rule data requirements.

### Transaction Limit Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract TransactionLimited is AccessControl {
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error LimitTooLow();

    event TransactionLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event TravelRuleTriggered(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    // Travel Rule threshold: HKD 8,000 equivalent
    uint256 public constant TRAVEL_RULE_THRESHOLD = 8000e18;

    uint256 public transactionLimit;
    uint256 public dailyLimit;

    mapping(address => uint256) private _dailySpent;
    mapping(address => uint256) private _lastSpendDay;

    modifier withinTransactionLimit(uint256 amount) {
        if (amount > transactionLimit) {
            revert ExceedsTransactionLimit(amount, transactionLimit);
        }
        _;
    }

    modifier withinDailyLimit(uint256 amount) {
        _checkDailyLimit(msg.sender, amount);
        _;
    }

    modifier checkTravelRule(address recipient, uint256 amount) {
        if (amount >= TRAVEL_RULE_THRESHOLD) {
            emit TravelRuleTriggered(msg.sender, recipient, amount, block.timestamp);
        }
        _;
    }

    function setTransactionLimit(uint256 newLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newLimit == 0) revert LimitTooLow();
        uint256 oldLimit = transactionLimit;
        transactionLimit = newLimit;
        emit TransactionLimitUpdated(oldLimit, newLimit);
    }

    function setDailyLimit(uint256 newLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newLimit == 0) revert LimitTooLow();
        uint256 oldLimit = dailyLimit;
        dailyLimit = newLimit;
        emit DailyLimitUpdated(oldLimit, newLimit);
    }

    function getDailyRemaining(address account) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        if (_lastSpendDay[account] != today) {
            return dailyLimit;
        }
        return dailyLimit - _dailySpent[account];
    }

    function _checkDailyLimit(address account, uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;

        if (_lastSpendDay[account] != today) {
            _lastSpendDay[account] = today;
            _dailySpent[account] = 0;
        }

        uint256 remaining = dailyLimit - _dailySpent[account];
        if (amount > remaining) revert ExceedsDailyLimit(amount, remaining);

        _dailySpent[account] += amount;
    }
}
```

### Usage

```solidity
contract CompliantVault is KYCGated, TransactionLimited, ReentrancyGuard {
    constructor(
        address kycAddress,
        uint256 txLimit,
        uint256 dayLimit
    ) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        transactionLimit = txLimit;
        dailyLimit = dayLimit;
    }

    function withdraw(uint256 amount)
        external
        onlyVerifiedHuman
        withinTransactionLimit(amount)
        withinDailyLimit(amount)
        checkTravelRule(msg.sender, amount)
        nonReentrant
    {
        // withdrawal logic
    }

    function transfer(address to, uint256 amount)
        external
        onlyVerifiedHuman
        withinTransactionLimit(amount)
        checkTravelRule(to, amount)
        nonReentrant
    {
        // transfer logic
    }
}
```

### Tiered Limits Based on KYC Level

```solidity
function getEffectiveLimit(address account) public view returns (uint256) {
    (, uint8 level) = kycContract.isHuman(account);
    if (level >= 4) return type(uint256).max;   // Ultimate: no limit
    if (level >= 3) return 1_000_000e18;         // Premium: 1M
    if (level >= 2) return 100_000e18;           // Advanced: 100K
    if (level >= 1) return 10_000e18;            // Basic: 10K
    return 0;                                     // No KYC: no access
}
```

## When to Use

- On all functions that move value (deposits, withdrawals, swaps, transfers).
- When the protocol handles assets that may be subject to Travel Rule reporting.
- When implementing tiered access based on KYC verification level.
- For AML compliance where transaction monitoring is required.

## Related Regulations

| Regulation | Threshold | Requirement |
|------------|-----------|-------------|
| FATF Recommendation 16 | USD/EUR 1,000 | Full originator/beneficiary data for wire transfers |
| Hong Kong AMLO Schedule 2 | HKD 8,000 | Full Travel Rule data above threshold |
| EU TFR (Recast) | EUR 0 (zero threshold) | Travel Rule data for all crypto transfers |
| US FinCEN | USD 3,000 | Travel Rule for funds transfers |

## Design Considerations

1. **Threshold Currency:** The `TRAVEL_RULE_THRESHOLD` constant is in token-native units. For a stablecoin pegged 1:1 to HKD, 8000e18 is correct. For other tokens, you need an oracle to convert to HKD equivalent.
2. **Daily Reset:** The daily limit resets based on UTC day boundaries (`block.timestamp / 1 days`). Be aware that L2 timestamps are set by the Sequencer and may not be exactly synchronized.
3. **Aggregate vs Per-Transaction:** The pattern enforces both per-transaction (`transactionLimit`) and aggregate daily (`dailyLimit`) limits. Both are necessary for comprehensive compliance.
4. **Event-Driven Compliance:** The `TravelRuleTriggered` event signals off-chain systems to collect and transmit Travel Rule data. The smart contract does not store personal data on-chain.

## HashKey Chain Specific Considerations

1. **HSK Denomination:** If the contract handles native HSK, limits should account for HSK/HKD exchange rate. Use APRO oracle's HSK/USD feed at `0x86CE42c1b714149Dc3A7b169EF67b5F78A224b` for price conversion.
2. **Low Gas Costs:** The daily limit tracking adds storage reads/writes, but HashKey Chain's low L2 fees make this negligible.
3. **2-Second Block Time:** With faster blocks, the daily limit mechanism works the same, but be aware that more transactions can occur within a day compared to Ethereum mainnet.

## Source

FATF Recommendation 16 (Travel Rule). Hong Kong AMLO Schedule 2. CompliBot CompliantVault example contract (`src/examples/CompliantVault.sol`).
