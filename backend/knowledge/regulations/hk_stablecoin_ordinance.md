# Hong Kong Stablecoin Ordinance

## Overview

Hong Kong's stablecoin regulatory framework was introduced through the Stablecoins Bill (formally the "Stablecoins Bill" under the AMLO amendments), which establishes a licensing regime for fiat-referenced stablecoin (FRS) issuers. The bill was introduced to the Legislative Council (LegCo) in December 2024, with the Hong Kong Monetary Authority (HKMA) designated as the primary regulator.

## Scope

### What Is Covered

The ordinance regulates **fiat-referenced stablecoins (FRS)** defined as:
- Crypto-assets that purport to maintain a stable value with reference to one or more fiat currencies.
- This includes stablecoins pegged to a single fiat currency (e.g., USD, HKD, EUR) or a basket of fiat currencies.

### What Is NOT Covered

- Crypto-assets referenced to commodities (e.g., gold-backed tokens).
- Crypto-assets referenced to other crypto-assets (algorithmic stablecoins backed by crypto).
- Tokenized deposits issued by authorized institutions.
- Central bank digital currencies (CBDC).

### Territorial Nexus

The licensing requirement applies to:
1. Any person who issues an FRS in Hong Kong.
2. Any person who issues an FRS that purports to reference the Hong Kong dollar (HKD), regardless of where the issuer is located.
3. Any person who actively markets the issuance of FRS to the Hong Kong public.

## Licensing Requirements

### Who Must Be Licensed

Any FRS issuer falling within the territorial scope must obtain a license from the HKMA. Operating without a license is a criminal offense.

### Eligibility Criteria

| Requirement | Detail |
|-------------|--------|
| Entity Type | Must be a company incorporated in Hong Kong, or a company registered under the Companies Ordinance |
| Fitness and Properness | Directors, controllers, and key personnel must be fit and proper |
| Financial Resources | Must maintain adequate financial resources (minimum capital requirements to be specified by HKMA) |
| Operational Capability | Must demonstrate adequate operational and risk management systems |
| Governance | Must have a robust governance framework, including board oversight and internal controls |

### Application Process

1. Submit application to HKMA with required documentation.
2. HKMA assesses fitness and properness, financial soundness, and operational capability.
3. HKMA may impose conditions on the license.
4. License must be renewed periodically.

## Reserve Requirements

### Composition

FRS issuers must maintain a reserve of assets that:
1. **Full Backing:** The value of reserve assets must at all times be equal to or greater than the par value of all outstanding FRS.
2. **High Quality:** Reserve assets must consist of high-quality, highly liquid assets denominated in the same currency as the referenced fiat currency.
3. **Segregation:** Reserve assets must be segregated from the issuer's own assets.
4. **Custody:** Reserve assets must be held by authorized custodians (e.g., licensed banks in Hong Kong).

### Acceptable Reserve Assets

The HKMA is expected to specify acceptable reserve assets, which are likely to include:
- Cash deposits at authorized institutions.
- Government securities (e.g., HKSAR Exchange Fund Bills, US Treasury Bills).
- Short-term high-quality government debt instruments.

### Prohibitions

- Reserve assets must NOT be encumbered, pledged, or used as collateral.
- The issuer must NOT lend, re-hypothecate, or otherwise use reserve assets for its own account.
- The issuer must NOT invest reserve assets in higher-risk instruments.

### Attestation and Reporting

- Monthly attestation of reserve composition and adequacy by an independent auditor.
- Annual full audit of reserve assets.
- Public disclosure of reserve composition on at least a monthly basis.

## Redemption Rights

### Mandatory Redemption

FRS issuers must provide holders with a right to redeem their FRS at par value:
1. **At Par:** Redemption must be at face value (1:1 ratio to the referenced fiat currency).
2. **Timely:** Redemption requests must be honored within a reasonable timeframe (likely within 1-5 business days).
3. **No Unreasonable Fees:** Redemption fees, if any, must be reasonable and clearly disclosed.
4. **Direct Redemption:** Holders must be able to redeem directly with the issuer (not just through secondary markets).

### Redemption in Stress Scenarios

- The issuer must maintain an orderly redemption plan for periods of high redemption demand.
- The HKMA may direct the issuer to implement wind-down or redemption procedures.

## Operational Requirements

### Risk Management

- Robust operational risk management, including cybersecurity.
- Business continuity and disaster recovery plans.
- IT systems audited regularly.

### AML/CFT

FRS issuers are subject to the same AML/CFT requirements under the AMLO:
- CDD for holders (where the issuer has a direct relationship).
- Transaction monitoring.
- STR filing.
- Travel Rule compliance for transfers.

### Consumer Protection

- Clear and transparent disclosure of terms, risks, and fees.
- Complaint-handling mechanism.
- Marketing must not be misleading.

## Smart Contract Relevance

For stablecoin implementations on HashKey Chain:

### Reserve Management
```solidity
// On-chain reserve proof can complement off-chain attestations
event ReserveUpdated(uint256 totalSupply, uint256 reserveValue, uint256 timestamp);
event ReserveAttestationPublished(bytes32 attestationHash, uint256 period);
```

### Redemption Mechanism
```solidity
// Mandatory redemption at par value
function redeem(uint256 amount) external onlyVerifiedHuman nonReentrant {
    require(amount > 0, "Zero amount");
    _burn(msg.sender, amount);
    // Transfer equivalent fiat-denominated stablecoin or initiate off-chain settlement
    emit Redeemed(msg.sender, amount, block.timestamp);
}
```

### Compliance Integration
1. **KYC Gate:** All holders must be KYC-verified through HashKey KYC SBT.
2. **Transfer Restrictions:** Only allow transfers between KYC-verified addresses.
3. **Blacklist:** Integrate sanctions screening to block transfers to/from sanctioned addresses.
4. **Pause:** Emergency pause for regulatory intervention.
5. **Supply Cap:** Enforce that total supply never exceeds proven reserve value.

## Comparison with Other Jurisdictions

| Feature | Hong Kong FRS | EU MiCA (EMT) | Singapore (MAS) |
|---------|---------------|---------------|-----------------|
| Regulator | HKMA | National competent authority | MAS |
| Full Reserve | Yes | Yes | Yes |
| Redemption at Par | Yes | Yes | Yes |
| Interest Prohibited | TBD | Yes | No explicit prohibition |
| Audit | Monthly attestation + annual | Periodic audit | Independent audit |
| AML/CFT | AMLO Schedule 2 | EU TFR | Payment Services Act |

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| Stablecoins Bill | Introduced to LegCo, December 2024 |
| HKMA Discussion Paper on Crypto-Assets and Stablecoins | January 2022 |
| HKMA Consultation Paper on FRS Regulation | December 2023 |
| HKMA Stablecoin Sandbox | Launched March 2024 |
| AMLO, Cap. 615 | AML/CFT requirements for licensed FRS issuers |

## Source

Hong Kong Monetary Authority. "Discussion Paper: Crypto-Assets and Stablecoins" (January 2022). "Consultation Conclusions on Legislative Proposal for Fiat-Referenced Stablecoins Regulatory Regime" (December 2023). Available at https://www.hkma.gov.hk.
