# Hong Kong SFC Virtual Asset Trading Platform (VATP) Guidelines

## Overview

The Securities and Futures Commission (SFC) of Hong Kong established a licensing regime for Virtual Asset Trading Platforms (VATPs) under the Anti-Money Laundering and Counter-Terrorist Financing Ordinance (AMLO), effective June 1, 2023. All centralized virtual asset exchanges operating in Hong Kong or marketing to Hong Kong investors must obtain a license from the SFC.

## Licensing Requirements

### License Types

**Type 1 License (Dealing in Securities)**
- Required when a platform deals in virtual assets classified as "securities" under the Securities and Futures Ordinance (SFO).
- Applies to tokens that constitute shares, debentures, or interests in collective investment schemes.
- Capital requirement: HKD 5 million minimum paid-up share capital.
- Responsible Officers (ROs) must have relevant industry experience and pass competency requirements.

**Type 7 License (Providing Automated Trading Services)**
- Required for operating a platform that provides automated trading services for virtual assets.
- This is the primary license type for operating a virtual asset exchange in Hong Kong.
- Capital requirement: HKD 5 million minimum paid-up share capital.
- Must maintain liquid capital at all times as prescribed by the Securities and Futures (Financial Resources) Rules.

**Dual License Requirement**
- VATPs must hold both Type 1 and Type 7 licenses to operate a virtual asset trading platform in Hong Kong.
- Both licenses are subject to additional conditions specific to virtual asset activities.

### Key Conditions for VATP Licensees

1. **Professional Investors Only (initially):** Licensed platforms were initially restricted to serving professional investors only. The SFC has since relaxed this to allow retail access under specific conditions.
2. **Retail Access Requirements (since SFC Circular, October 2023):**
   - Must implement knowledge assessment for retail investors.
   - Must set reasonable exposure limits for individual retail clients.
   - Virtual assets available for retail trading must meet specific admission criteria (e.g., inclusion in two acceptable indices with a minimum combined market cap).
3. **Insurance/Compensation:** Must maintain insurance or compensation arrangements covering risks of loss of client virtual assets held in custody (target coverage: 50% of client virtual assets in cold storage, 100% of hot storage).
4. **External Market Surveillance:** Must implement or subscribe to market surveillance systems to identify, monitor, and report suspicious trading activities.

## AML/KYC Requirements

### Customer Due Diligence (CDD)

Under the AMLO, VATPs must perform CDD measures before establishing a business relationship:

- **Identity Verification:** Verify the identity of clients using reliable, independent source documents.
- **Beneficial Ownership:** Identify and verify the beneficial owner of any client that is a legal entity.
- **Purpose of Account:** Understand the purpose and intended nature of the business relationship.
- **Ongoing Monitoring:** Continuously monitor transactions to ensure they are consistent with the VATP's knowledge of the customer.
- **Enhanced Due Diligence (EDD):** Apply EDD for higher-risk customers, including politically exposed persons (PEPs), customers from high-risk jurisdictions, and unusually large transactions.

### Risk-Based Approach

- Platforms must conduct institutional risk assessments to identify ML/TF risks.
- Customer risk profiling must be applied, and resources allocated based on assessed risk levels.
- Higher-risk customers require more frequent reviews and monitoring.

### Suspicious Transaction Reporting (STR)

- VATPs must file STRs with the Joint Financial Intelligence Unit (JFIU) when there are grounds for suspicion.
- No tipping off: staff must not disclose to the customer that an STR has been or will be filed.
- Record-keeping: maintain records of all STRs and supporting documentation.

## Custody Requirements

### Segregation of Assets

- Client assets must be held on trust and must be segregated from the platform's proprietary assets.
- A licensed VATP must use a wholly-owned subsidiary licensed by the SFC (Type 1 license) as its associated entity to provide custody services.

### Cold Storage Requirements

- At least 98% of client virtual assets must be stored in cold storage (offline, air-gapped).
- Hot wallet holdings must be minimized and covered by insurance or compensation arrangements.

### Seed Phrase and Key Management

- Private keys must be stored in Hong Kong.
- Multi-signature or threshold signature schemes are required.
- No single person should have sole control over a private key or seed phrase that provides access to client assets.
- Backup and disaster recovery procedures must be documented and tested.

## Smart Contract Relevance

For developers on HashKey Chain (operated by HashKey Group, an SFC-licensed entity), these guidelines have direct implications:

1. **KYC Integration:** Smart contracts handling user funds should integrate with HashKey Chain's KYC SBT system to verify user identity on-chain before allowing participation.
2. **Transaction Limits:** Implement per-transaction and daily limits to comply with AML monitoring requirements.
3. **Access Control:** Restrict administrative functions to authorized addresses; implement multi-sig for critical operations.
4. **Pause Mechanisms:** Include emergency pause functionality to comply with the SFC's requirement for orderly market maintenance.
5. **Event Emissions:** Emit detailed events for deposits, withdrawals, and transfers to support off-chain monitoring and reporting.
6. **Asset Segregation:** Keep protocol-owned assets separate from user deposits at the contract level.

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| AMLO Part 5A | Licensing of VATPs |
| SFC Guidelines for VATP Operators | June 2023 |
| SFC Circular on Retail Access | October 2023 |
| Securities and Futures Ordinance (SFO) Cap. 571 | Definitions of securities |
| SFC Code of Conduct | Chapter 12 (for licensed VATPs) |
| SFC AML/CTF Guideline | For Licensed Corporations and SFC-Licensed VATPs |

## Source

Hong Kong Securities and Futures Commission. "Guidelines for Virtual Asset Trading Platform Operators." Published June 2023, updated periodically. Available at https://www.sfc.hk.
