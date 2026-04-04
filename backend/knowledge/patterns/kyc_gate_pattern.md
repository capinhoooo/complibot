# KYC Gate Modifier Pattern

## Problem

Smart contracts on HashKey Chain that handle user funds or regulated activities need to verify that interacting users have completed KYC verification. Without KYC verification, the contract cannot satisfy regulatory requirements under the Hong Kong AMLO, FATF guidelines, or SFC VATP licensing conditions.

## Solution

Use the HashKey Chain KYC SBT system to gate function access. The `IHashKeyKYC` interface provides `isHuman()` for basic verification and `getKycInfo()` for detailed checks. Wrap these calls in Solidity modifiers that revert if the caller is not verified.

### Basic KYC Gate

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHashKeyKYC} from "../interfaces/IHashKeyKYC.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract KYCGated is AccessControl {
    error KYCNotVerified(address account);
    error KYCInsufficientLevel(address account, uint8 required, uint8 actual);
    error KYCContractZeroAddress();

    event KYCContractUpdated(address indexed oldKycContract, address indexed newKycContract);

    IHashKeyKYC public kycContract;

    modifier onlyVerifiedHuman() {
        (bool isValid,) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        _;
    }

    modifier onlyMinKycLevel(uint8 minLevel) {
        (bool isValid, uint8 level) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        if (level < minLevel) revert KYCInsufficientLevel(msg.sender, minLevel, level);
        _;
    }

    constructor(address kycContract_) {
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        kycContract = IHashKeyKYC(kycContract_);
    }

    function setKycContract(address newKycContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newKycContract == address(0)) revert KYCContractZeroAddress();
        address old = address(kycContract);
        kycContract = IHashKeyKYC(newKycContract);
        emit KYCContractUpdated(old, newKycContract);
    }
}
```

### Usage

```solidity
contract MyProtocol is KYCGated, ReentrancyGuard {
    constructor(address kycAddress) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Any verified user can call
    function deposit() external payable onlyVerifiedHuman nonReentrant {
        // deposit logic
    }

    // Only Advanced (level 2+) KYC users
    function largeTrade(uint256 amount) external onlyMinKycLevel(2) nonReentrant {
        // trade logic
    }

    // Only Premium (level 3+) KYC users
    function institutionalAction() external onlyMinKycLevel(3) nonReentrant {
        // institutional logic
    }
}
```

### Checking a Different Address

Sometimes you need to verify a user other than `msg.sender` (e.g., verifying a beneficiary address):

```solidity
function transferTo(address recipient, uint256 amount) external onlyVerifiedHuman {
    // Also verify the recipient
    (bool recipientValid,) = kycContract.isHuman(recipient);
    if (!recipientValid) revert KYCNotVerified(recipient);

    // Execute transfer
    _transfer(msg.sender, recipient, amount);
}
```

## When to Use

- **Always** on functions that accept, transfer, or release user funds (deposits, withdrawals, swaps, lending, borrowing).
- **Always** on functions that mint or burn tokens representing regulated assets.
- **Recommended** on governance functions to ensure only verified participants vote.
- **Optional** on pure read functions (view/pure), since no state change occurs and no regulatory action is triggered.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| Hong Kong AMLO Schedule 2 | CDD before establishing business relationship |
| SFC VATP Guidelines | KYC verification for all platform users |
| FATF Recommendation 10 | Customer Due Diligence |
| FATF Rec. 15 (Interpretive Note) | VASPs must apply CDD requirements |
| EU MiCA, Article 68 | CASPs must apply CDD measures |

## KYC Level Guidelines

| Operation | Recommended Minimum Level |
|-----------|--------------------------|
| Read-only queries | No KYC required |
| Small value transfers (< HKD 8,000) | Level 1 (Basic) |
| Standard transactions | Level 1 (Basic) |
| Large value transfers (>= HKD 8,000) | Level 2 (Advanced) |
| Institutional operations | Level 3 (Premium) |
| Token issuance / significant governance | Level 4 (Ultimate) |

## HashKey Chain Specific Considerations

1. **Gas Cost:** Each `isHuman` call adds approximately 2,600 gas for the external STATICCALL. On HashKey Chain's low-fee L2, this is negligible.
2. **KYC Contract Address:** Store the address as a mutable state variable (not immutable) so it can be updated if HashKey deploys a new KYC contract. Protect the setter with `onlyRole(DEFAULT_ADMIN_ROLE)`.
3. **Testnet vs Mainnet:** The KYC contract addresses differ between networks. Use constructor injection rather than hardcoding.
4. **Revocation Handling:** The `isHuman` function returns `false` if a user's KYC has been revoked. Existing positions or balances are not automatically affected; consider implementing a sweep mechanism for revoked users if regulatory requirements demand it.
5. **Custom Errors:** Use custom errors (`KYCNotVerified`, `KYCInsufficientLevel`) instead of `require` strings for gas efficiency and better error handling in frontends.

## Source

HashKey Chain KYC SBT system. IHashKeyKYC interface from CompliBot contract codebase. KYCGated base contract from `src/base/KYCGated.sol`.
