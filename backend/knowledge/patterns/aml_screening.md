# AML Screening Integration Pattern

## Problem

Anti-Money Laundering (AML) regulations require VASPs and regulated protocols to screen transactions against sanctions lists and block transfers involving sanctioned addresses. Smart contracts need a mechanism to check addresses against known blacklists before allowing transfers, deposits, or withdrawals.

## Solution

Implement an on-chain blacklist/allowlist registry that can be updated by compliance officers and checked by transfer functions. The blacklist can be maintained by the protocol itself or integrated with external oracle-based sanctions screening services.

### Blacklist Registry

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract AMLScreening is AccessControl {
    error AddressBlacklisted(address account);
    error AddressNotBlacklisted(address account);

    event AddressBlacklistedEvent(address indexed account, string reason, uint256 timestamp);
    event AddressRemovedFromBlacklist(address indexed account, string reason, uint256 timestamp);
    event BlacklistOracleUpdated(address indexed oldOracle, address indexed newOracle);

    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    mapping(address => bool) public isBlacklisted;
    address public blacklistOracle; // Optional: external oracle for sanctions data

    modifier notBlacklisted(address account) {
        if (isBlacklisted[account]) revert AddressBlacklisted(account);
        _;
    }

    modifier neitherBlacklisted(address from, address to) {
        if (isBlacklisted[from]) revert AddressBlacklisted(from);
        if (isBlacklisted[to]) revert AddressBlacklisted(to);
        _;
    }

    function addToBlacklist(address account, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        isBlacklisted[account] = true;
        emit AddressBlacklistedEvent(account, reason, block.timestamp);
    }

    function removeFromBlacklist(address account, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        if (!isBlacklisted[account]) revert AddressNotBlacklisted(account);
        isBlacklisted[account] = false;
        emit AddressRemovedFromBlacklist(account, reason, block.timestamp);
    }

    function batchAddToBlacklist(address[] calldata accounts, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            isBlacklisted[accounts[i]] = true;
            emit AddressBlacklistedEvent(accounts[i], reason, block.timestamp);
        }
    }

    function batchRemoveFromBlacklist(address[] calldata accounts, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            isBlacklisted[accounts[i]] = false;
            emit AddressRemovedFromBlacklist(accounts[i], reason, block.timestamp);
        }
    }
}
```

### Usage with Full Compliance Stack

```solidity
contract CompliantVault is KYCGated, AMLScreening, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    constructor(address admin, address kycAddress) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
    }

    function deposit(address token, uint256 amount)
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
    {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    function transfer(address to, uint256 amount)
        external
        onlyVerifiedHuman
        neitherBlacklisted(msg.sender, to)
        whenNotPaused
        nonReentrant
    {
        // Transfer logic checking both sender and recipient
    }
}
```

### Oracle-Based Screening (Advanced)

For dynamic sanctions screening that updates more frequently:

```solidity
interface IAMLOracle {
    function isSanctioned(address account) external view returns (bool);
    function riskScore(address account) external view returns (uint8); // 0-100
}

abstract contract OracleAMLScreening is AMLScreening {
    IAMLOracle public amlOracle;

    uint8 public maxAllowedRiskScore = 70;

    error RiskScoreTooHigh(address account, uint8 score, uint8 max);

    modifier passesAMLCheck(address account) {
        // Check local blacklist first
        if (isBlacklisted[account]) revert AddressBlacklisted(account);

        // Check oracle if available
        if (address(amlOracle) != address(0)) {
            if (amlOracle.isSanctioned(account)) {
                revert AddressBlacklisted(account);
            }

            uint8 score = amlOracle.riskScore(account);
            if (score > maxAllowedRiskScore) {
                revert RiskScoreTooHigh(account, score, maxAllowedRiskScore);
            }
        }
        _;
    }

    function setAMLOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address old = address(amlOracle);
        amlOracle = IAMLOracle(oracle);
        emit BlacklistOracleUpdated(old, oracle);
    }

    function setMaxRiskScore(uint8 score) external onlyRole(COMPLIANCE_ROLE) {
        maxAllowedRiskScore = score;
    }
}
```

## Sanctions Lists to Screen Against

| List | Jurisdiction | Maintained By |
|------|-------------|---------------|
| OFAC SDN List | United States | Office of Foreign Assets Control |
| UN Security Council Consolidated List | International | United Nations |
| EU Consolidated Sanctions List | European Union | EU Council |
| HK Gazette (UN Sanctions) | Hong Kong | Commerce and Economic Development Bureau |
| FATF High-Risk and Other Monitored Jurisdictions | International | FATF |

## When to Use

- **Always** on protocols that handle value transfers and are subject to AML regulations.
- When the protocol must comply with international sanctions regimes.
- When operating on a regulated chain like HashKey Chain where the operator (HashKey Group) must enforce sanctions compliance.
- When the protocol interacts with real-world assets (RWAs) or stablecoins.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| Hong Kong AMLO | Sanctions screening for all VATPs |
| Hong Kong UN Sanctions Ordinance, Cap. 537 | Implementation of UN financial sanctions |
| FATF Recommendations 6, 7 | Targeted financial sanctions |
| OFAC Compliance Requirements | SDN list screening for US-connected transactions |
| EU Regulation 2580/2001 | EU sanctions framework |

## Design Considerations

1. **Centralization vs Decentralization:** Blacklist management is inherently centralized (someone must decide who goes on the list). Minimize trust by requiring multi-sig for blacklist additions and emitting clear events for transparency.
2. **False Positives:** Blacklist entries should be removable. Implement a process for users to contest their inclusion.
3. **Gas Costs:** Each blacklist check adds a storage read (~2,100 gas for warm access, ~2,600 for cold). On HashKey Chain, this is negligible.
4. **Batch Operations:** Use batch functions for bulk updates (e.g., when processing a new OFAC list update).
5. **Reason Logging:** Always include a `reason` parameter in blacklist events for audit trail purposes.

## HashKey Chain Specific Considerations

1. **Dual-Layer Screening:** HashKey Group may implement its own sanctions screening at the infrastructure level. Protocol-level screening provides defense-in-depth.
2. **KYC + AML Stack:** Combine the KYC gate (`onlyVerifiedHuman`) with AML screening (`notBlacklisted`) for comprehensive compliance. The KYC check verifies identity; the AML check verifies the address is not sanctioned.
3. **Modifier Order:** Apply modifiers in this order: `onlyVerifiedHuman`, `notBlacklisted`, `whenNotPaused`, `nonReentrant`. This ensures the cheapest checks (blacklist lookup) happen after the most important check (KYC), and all checks happen before the reentrancy lock.

## Source

FATF Recommendations 6 and 7 on targeted financial sanctions. Hong Kong UN Sanctions Ordinance, Cap. 537. OFAC compliance guidance.
