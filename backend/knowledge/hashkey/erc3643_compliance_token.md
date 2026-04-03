# ERC-3643: Compliant Token Standard (T-REX)

## Overview

ERC-3643, also known as T-REX (Token for Regulated EXchanges), is an Ethereum token standard designed for regulated securities and compliant tokens. It extends ERC-20 with identity verification and compliance rule enforcement at the token level, making it suitable for security tokens, regulated stablecoins, and other assets that require transfer restrictions.

## Architecture

ERC-3643 consists of several interconnected components:

### Core Components

1. **Token Contract:** The ERC-20 compatible token with compliance hooks on all transfer functions.
2. **Identity Registry:** Maps token holder addresses to their on-chain identity (via ONCHAINID standard).
3. **Identity Registry Storage:** Stores the mapping between addresses and identity contracts.
4. **Compliance Contract:** Implements the transfer rules (e.g., investor count limits, jurisdiction restrictions, holding period).
5. **Trusted Issuers Registry:** Stores the list of claim issuers trusted for identity verification.
6. **Claim Topics Registry:** Defines which types of claims (e.g., KYC, accredited investor) are required.

### How Transfers Work

```
1. User calls transfer(to, amount)
2. Token contract checks Identity Registry:
   a. Is sender registered? Does sender have required claims?
   b. Is recipient registered? Does recipient have required claims?
3. Token contract checks Compliance contract:
   a. Does this transfer comply with all active rules?
4. If all checks pass, transfer executes.
5. If any check fails, transfer reverts.
```

## Key Interfaces

### IToken (ERC-3643 Token)

```solidity
interface IToken is IERC20 {
    // Compliance-aware transfer
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // Forced transfers (by agent, e.g., for legal recovery)
    function forcedTransfer(address from, address to, uint256 amount) external returns (bool);

    // Freeze/unfreeze
    function setAddressFrozen(address addr, bool freeze) external;
    function freezePartialTokens(address addr, uint256 amount) external;
    function unfreezePartialTokens(address addr, uint256 amount) external;

    // Token recovery
    function recoveryAddress(address lostWallet, address newWallet, address investorOnchainID) external returns (bool);

    // Pause
    function pause() external;
    function unpause() external;

    // Agent management
    function addAgent(address agent) external;
    function removeAgent(address agent) external;
}
```

### IIdentityRegistry

```solidity
interface IIdentityRegistry {
    function isVerified(address addr) external view returns (bool);
    function identity(address addr) external view returns (address);
    function investorCountry(address addr) external view returns (uint16);
    function registerIdentity(address addr, address identity, uint16 country) external;
    function deleteIdentity(address addr) external;
    function updateIdentity(address addr, address identity) external;
    function updateCountry(address addr, uint16 country) external;
}
```

### ICompliance

```solidity
interface ICompliance {
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    function transferred(address from, address to, uint256 amount) external;
    function created(address to, uint256 amount) external;
    function destroyed(address from, uint256 amount) external;
}
```

## Compliance Modules

ERC-3643 supports pluggable compliance modules. Common modules include:

### 1. Country Restrict Module
Restricts transfers to/from addresses in specific jurisdictions.

```solidity
// Check if investor's country is allowed
function canTransfer(address from, address to, uint256 amount) external view returns (bool) {
    uint16 toCountry = identityRegistry.investorCountry(to);
    return !restrictedCountries[toCountry];
}
```

### 2. Max Holders Module
Limits the total number of token holders.

### 3. Max Balance Module
Caps the maximum token balance any single holder can have.

### 4. Time Transfer Limits Module
Enforces holding periods or transfer cooldown periods.

### 5. Exchange Monthly Limits Module
Limits the volume of tokens that can be traded on exchanges within a given period.

## Relevance to HashKey Chain

### Integration with KYC SBT

On HashKey Chain, the Identity Registry component can be simplified by leveraging the native KYC SBT system:

```solidity
import {IHashKeyKYC} from "./interfaces/IHashKeyKYC.sol";

contract HashKeyIdentityRegistry {
    IHashKeyKYC public kycContract;

    function isVerified(address addr) external view returns (bool) {
        (bool isValid, ) = kycContract.isHuman(addr);
        return isValid;
    }

    function getKycLevel(address addr) external view returns (uint8) {
        (, uint8 level) = kycContract.isHuman(addr);
        return level;
    }
}
```

Instead of deploying a separate ONCHAINID system, developers can use the existing HashKey KYC SBT as the identity verification layer, significantly reducing deployment complexity.

### Simplified Architecture for HashKey Chain

```
Standard ERC-3643:
Token -> Identity Registry -> ONCHAINID -> Claim Issuers

HashKey Chain Simplified:
Token -> KYCGated (using IHashKeyKYC) -> HashKey KYC SBT
```

This means:
1. No need to deploy ONCHAINID contracts.
2. No need to manage Trusted Issuers.
3. No need to manage Claim Topics.
4. KYC verification is provided by the chain's native infrastructure.

### Compliance Module Patterns

For HashKey Chain, common compliance patterns include:
- **KYC Gate:** Use `onlyVerifiedHuman` modifier (see `kyc_gate_pattern.md`).
- **Jurisdiction Check:** Use KYC level as a proxy or integrate with off-chain jurisdiction data (see `jurisdiction_check.md`).
- **Transaction Limits:** Enforce FATF Travel Rule thresholds (see `transaction_limit.md`).
- **Transfer Restrictions:** Implement allowlist/blocklist patterns for sanctioned addresses.

## Implementation Considerations

### Gas Costs

ERC-3643 adds compliance checks to every transfer, which increases gas costs:
- `isHuman` call: ~2,600 gas (external STATICCALL)
- `canTransfer` compliance check: varies by module complexity
- Each additional compliance module adds to the transfer cost

On HashKey Chain, the low L2 execution fees make these additional checks economically feasible.

### Upgradeability

- Compliance modules should be upgradeable to adapt to changing regulations.
- Use a proxy pattern or modular compliance contract that allows adding/removing modules.
- The token itself may also need upgradeability for regulatory changes.

### Forced Transfer

ERC-3643 includes a `forcedTransfer` function for legal recovery scenarios (e.g., court orders, lost access). This is an agent-only function and should be protected with strict access control.

## Key References

| Document | Reference |
|----------|-----------|
| EIP-3643 | Token for Regulated EXchanges (T-REX) |
| ONCHAINID | On-chain identity standard used by ERC-3643 |
| ERC-20 | Base fungible token standard |
| T-REX GitHub | https://github.com/TokenySolutions/T-REX |

## Source

EIP-3643: Token for Regulated EXchanges. Available at https://eips.ethereum.org/EIPS/eip-3643. Tokeny Solutions T-REX documentation. Available at https://github.com/TokenySolutions/T-REX.
