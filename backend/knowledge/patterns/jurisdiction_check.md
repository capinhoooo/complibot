# Jurisdiction-Based Access Control Pattern

## Problem

Regulated protocols must restrict access based on the user's jurisdiction. Certain jurisdictions may be sanctioned, may not have a regulatory framework for virtual assets, or may require specific compliance measures. Smart contracts need a mechanism to enforce geographic restrictions on-chain.

## Solution

Implement a jurisdiction registry that maps addresses to country codes and use modifiers to restrict or allow access based on jurisdiction. Since on-chain data cannot directly determine physical location, this pattern relies on off-chain KYC/jurisdiction data that is attested on-chain.

### Jurisdiction Registry

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract JurisdictionControlled is AccessControl {
    error JurisdictionRestricted(address account, uint16 countryCode);
    error JurisdictionNotSet(address account);
    error InvalidCountryCode(uint16 countryCode);

    event JurisdictionSet(address indexed account, uint16 countryCode);
    event JurisdictionRestrictionUpdated(uint16 indexed countryCode, bool restricted);

    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // ISO 3166-1 numeric country codes
    mapping(address => uint16) public userJurisdiction;
    mapping(uint16 => bool) public restrictedJurisdictions;
    bool public jurisdictionCheckEnabled;

    modifier onlyAllowedJurisdiction() {
        if (jurisdictionCheckEnabled) {
            uint16 country = userJurisdiction[msg.sender];
            if (country == 0) revert JurisdictionNotSet(msg.sender);
            if (restrictedJurisdictions[country]) {
                revert JurisdictionRestricted(msg.sender, country);
            }
        }
        _;
    }

    modifier onlySpecificJurisdiction(uint16 requiredCountry) {
        uint16 country = userJurisdiction[msg.sender];
        if (country == 0) revert JurisdictionNotSet(msg.sender);
        if (country != requiredCountry) {
            revert JurisdictionRestricted(msg.sender, country);
        }
        _;
    }

    function setUserJurisdiction(address account, uint16 countryCode)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        if (countryCode == 0) revert InvalidCountryCode(countryCode);
        userJurisdiction[account] = countryCode;
        emit JurisdictionSet(account, countryCode);
    }

    function batchSetJurisdictions(
        address[] calldata accounts,
        uint16[] calldata countryCodes
    ) external onlyRole(COMPLIANCE_ROLE) {
        require(accounts.length == countryCodes.length, "Length mismatch");
        for (uint256 i = 0; i < accounts.length; i++) {
            if (countryCodes[i] == 0) revert InvalidCountryCode(countryCodes[i]);
            userJurisdiction[accounts[i]] = countryCodes[i];
            emit JurisdictionSet(accounts[i], countryCodes[i]);
        }
    }

    function setJurisdictionRestriction(uint16 countryCode, bool restricted)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        restrictedJurisdictions[countryCode] = restricted;
        emit JurisdictionRestrictionUpdated(countryCode, restricted);
    }

    function setJurisdictionCheckEnabled(bool enabled)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        jurisdictionCheckEnabled = enabled;
    }
}
```

### Usage with KYC Gate

```solidity
contract CompliantProtocol is KYCGated, JurisdictionControlled {
    constructor(address kycAddress) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
        jurisdictionCheckEnabled = true;

        // Restrict sanctioned jurisdictions (ISO 3166-1 numeric)
        restrictedJurisdictions[408] = true; // North Korea (DPRK)
        restrictedJurisdictions[364] = true; // Iran
        restrictedJurisdictions[760] = true; // Syria
        restrictedJurisdictions[729] = true; // Sudan
    }

    function trade(uint256 amount)
        external
        onlyVerifiedHuman
        onlyAllowedJurisdiction
    {
        // Only KYC-verified users from non-restricted jurisdictions
    }
}
```

### ISO 3166-1 Numeric Codes (Common)

| Code | Country |
|------|---------|
| 344 | Hong Kong |
| 156 | China |
| 840 | United States |
| 826 | United Kingdom |
| 392 | Japan |
| 702 | Singapore |
| 408 | North Korea (DPRK) |
| 364 | Iran |
| 760 | Syria |
| 643 | Russia |

## When to Use

- When the protocol must comply with international sanctions regimes (UN, OFAC, EU).
- When different jurisdictions have different regulatory requirements (e.g., EU MiCA vs. US SEC rules).
- When the protocol targets specific markets (e.g., Hong Kong only) and must restrict access from other jurisdictions.
- When implementing ERC-3643 compliant tokens that require country-based transfer restrictions.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| FATF Recommendation 6 | Targeted financial sanctions related to terrorism |
| FATF Recommendation 7 | Targeted financial sanctions related to proliferation |
| UN Security Council Resolutions | Country-specific sanctions |
| OFAC SDN List | US sanctions on specific countries and entities |
| EU Restrictive Measures | EU sanctions regulations |
| Hong Kong UN Sanctions Ordinance | HK implementation of UN sanctions |

## Design Considerations

1. **Off-Chain Jurisdiction Assignment:** Country codes must be assigned via an off-chain process (KYC provider, compliance team) and attested on-chain. The `COMPLIANCE_ROLE` manages this mapping.
2. **Privacy:** Only the country code is stored on-chain, not detailed location data.
3. **Batch Updates:** Use `batchSetJurisdictions` for gas-efficient bulk updates.
4. **Toggle:** The `jurisdictionCheckEnabled` flag allows the admin to enable/disable jurisdiction checks without redeploying.
5. **ERC-3643 Alignment:** This pattern aligns with the Country Restrict compliance module in the T-REX standard.

## HashKey Chain Specific Considerations

1. **Hong Kong Focus:** HashKey Chain is regulated in Hong Kong (ISO 344). Protocols may want to default to allowing Hong Kong users and restricting sanctioned jurisdictions.
2. **KYC Level as Proxy:** The KYC SBT level could serve as an indirect jurisdiction indicator, since HashKey's KYC process may include jurisdiction verification. However, this is not a reliable jurisdiction check and should be combined with explicit jurisdiction data.
3. **EAS Integration:** Consider using the Ethereum Attestation Service (EAS) predeploy on HashKey Chain to create jurisdiction attestations that can be verified on-chain.

## Source

ERC-3643 Country Restrict Module. FATF Recommendations 6 and 7 on targeted financial sanctions. ISO 3166-1 numeric country code standard.
