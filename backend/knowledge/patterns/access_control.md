# Role-Based Access Control Pattern

## Problem

Smart contracts managing regulated operations require granular permission control. Different operations should be restricted to different authorized parties: administrators, compliance officers, attesters, operators, and end users. A simple `onlyOwner` pattern is insufficient for regulated protocols that need separation of duties and the ability to delegate specific permissions.

## Solution

Use OpenZeppelin's `AccessControl` contract to implement role-based access control (RBAC). Define roles for each category of permissioned operation and assign them to appropriate addresses.

### Role Definition

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract CompliantProtocol is AccessControl {
    // Role definitions
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(address admin) {
        // Grant admin role (can manage all other roles)
        _grantRole(DEFAULT_ADMIN_ROLE, admin);

        // Optionally set role admins for delegation
        _setRoleAdmin(COMPLIANCE_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ATTESTER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(PAUSER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    // Admin-only functions
    function setConfiguration(uint256 value) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Configuration changes
    }

    // Compliance officer functions
    function updateBlacklist(address account, bool blacklisted)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        // Blacklist management
    }

    // Attester functions
    function issueCertificate(address target) external onlyRole(ATTESTER_ROLE) {
        // Compliance attestation
    }

    // Operator functions
    function executeOperation() external onlyRole(OPERATOR_ROLE) {
        // Operational actions
    }
}
```

### Recommended Role Structure for Compliant Protocols

| Role | Purpose | Who Holds It |
|------|---------|-------------|
| `DEFAULT_ADMIN_ROLE` | Manage other roles, upgrade contracts, emergency actions | Multi-sig wallet (3/5 or higher) |
| `COMPLIANCE_ROLE` | Manage blacklists, set jurisdiction restrictions, respond to regulatory requests | Compliance officer address |
| `ATTESTER_ROLE` | Issue compliance certificates, create attestations | Backend service / automated system |
| `OPERATOR_ROLE` | Day-to-day operational actions (e.g., rebalancing, fee collection) | Operations team address |
| `PAUSER_ROLE` | Emergency pause/unpause | Guardian multi-sig or monitoring bot |

### Multi-Role Patterns

Some addresses may need multiple roles:

```solidity
constructor(address admin, address complianceOfficer, address backend) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(COMPLIANCE_ROLE, complianceOfficer);
    _grantRole(ATTESTER_ROLE, backend);
    _grantRole(OPERATOR_ROLE, backend);
    // Backend has both attester and operator roles
}
```

### Role Renouncing

OpenZeppelin's `AccessControl` allows role holders to renounce their own roles:

```solidity
// User can renounce their own role
function renounceRole(bytes32 role, address callerConfirmation) public virtual override {
    // callerConfirmation must equal msg.sender (safety check)
    super.renounceRole(role, callerConfirmation);
}
```

### Combining with KYC Gate

```solidity
contract FullyCompliant is KYCGated, Pausable, ReentrancyGuard {
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    constructor(address admin, address kycAddress) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // User-facing: requires KYC
    function deposit() external payable onlyVerifiedHuman whenNotPaused nonReentrant {
        // deposit logic
    }

    // Admin-only: no KYC required for admin
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // emergency logic
    }

    // Compliance-only: manage restrictions
    function setRestriction(address account, bool restricted)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        // restriction logic
    }
}
```

## When to Use

- **Always** on regulated protocols to separate concerns and enable audit trails.
- When multiple parties need different levels of access to contract functions.
- When regulatory requirements mandate separation of duties (e.g., the person who approves transactions should not be the same person who initiates them).
- When the contract needs to support delegation of specific permissions without granting full admin access.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| SFC VATP Guidelines | Segregation of duties in platform operations |
| Hong Kong AMLO | Governance and internal controls |
| FATF Recommendations | Effective systems of governance and compliance management |
| EU MiCA Article 68 | Governance requirements for CASPs |

## AccessControl vs Ownable

| Feature | AccessControl | Ownable |
|---------|--------------|---------|
| Number of roles | Unlimited | 1 (owner) |
| Granularity | Per-function | All-or-nothing |
| Role delegation | Built-in (admin roles) | Manual |
| Multi-sig friendly | Yes (grant role to multi-sig) | Yes (set owner to multi-sig) |
| Gas overhead | Slightly higher (role mapping) | Lower |
| Regulatory fit | Excellent | Poor for regulated protocols |

## HashKey Chain Specific Considerations

1. **Multi-sig for Admin:** Use HashKey Chain's Safe (multi-sig) at `multisig.hashkeychain.net` for the `DEFAULT_ADMIN_ROLE`. This aligns with SFC requirements for multi-party authorization.
2. **Backend Service Roles:** The CompliBot backend (`ATTESTER_ROLE`) needs a dedicated wallet address. Store the private key securely and rotate periodically.
3. **KYCGated Inherits AccessControl:** The `KYCGated` base contract already inherits from `AccessControl`, so there is no need to import it separately when using `KYCGated`.
4. **Event Logging:** `AccessControl` emits `RoleGranted` and `RoleRevoked` events automatically, providing an audit trail of all role changes.

## Source

OpenZeppelin AccessControl (v5.x). CompliBot contract patterns. SFC VATP Guidelines on governance requirements.
