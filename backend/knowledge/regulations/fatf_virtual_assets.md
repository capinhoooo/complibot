# FATF Guidance on Virtual Assets and Virtual Asset Service Providers

## Overview

The Financial Action Task Force (FATF) published its "Updated Guidance for a Risk-Based Approach to Virtual Assets and Virtual Asset Service Providers" in October 2021. This guidance clarifies how FATF Standards apply to virtual assets (VAs) and virtual asset service providers (VASPs) and provides detailed guidance for jurisdictions and the private sector on implementing AML/CFT obligations.

## Key Definitions

### Virtual Asset (VA)

A virtual asset is a digital representation of value that can be digitally traded or transferred and can be used for payment or investment purposes. Virtual assets do not include:
- Digital representations of fiat currencies (central bank digital currencies/CBDCs).
- Securities or other financial assets already covered by FATF Recommendations.

### Virtual Asset Service Provider (VASP)

A VASP is any natural or legal person that conducts one or more of the following activities on behalf of another:
1. **Exchange** between virtual assets and fiat currencies.
2. **Exchange** between one or more forms of virtual assets.
3. **Transfer** of virtual assets (conducting a transaction on behalf of another).
4. **Safekeeping and/or administration** of virtual assets (custody).
5. **Participation in and provision of financial services** related to an issuer's offer and/or sale of a virtual asset.

### DeFi and the VASP Definition

The FATF guidance clarifies that DeFi applications may fall under VASP obligations:
- If there is an identifiable person or entity that maintains control or sufficient influence over a DeFi arrangement, that person/entity may qualify as a VASP.
- The mere creation or deployment of a smart contract does not automatically make a developer a VASP, but ongoing governance, control, or profit extraction may trigger VASP status.
- "Owner/operator" test: who profits from the DeFi arrangement, who controls its parameters, and who has the ability to alter or upgrade the protocol.

## Risk-Based Approach

### Country-Level Risk Assessment

Jurisdictions should:
1. Identify and assess ML/TF risks associated with VA activities within their borders.
2. Ensure that VASPs are licensed or registered.
3. Apply effective supervision to VASPs.
4. Apply appropriate sanctions for non-compliance.

### VASP-Level Risk Assessment

VASPs must:
1. Identify and assess ML/TF risks, considering customer risk factors, geographic risk, product/service risk, and delivery channel risk.
2. Document risk assessments and keep them up to date.
3. Allocate resources proportionate to assessed risks.

### Customer Risk Factors

| Risk Level | Indicators |
|------------|------------|
| Higher Risk | Anonymous or privacy-enhanced VAs, mixers/tumblers, transactions with unhosted wallets, connections to sanctioned jurisdictions, abnormally large transactions, PEPs |
| Standard Risk | Transactions between licensed VASPs, KYC-verified users, standard trading activity |
| Lower Risk | Low-value transactions, long-established customer relationships, transactions within regulated environments |

## Customer Due Diligence (CDD)

### Standard CDD Requirements

VASPs must perform CDD before establishing a business relationship or carrying out an occasional transaction above the threshold:

1. **Customer Identification:** Verify name, date of birth, address, and a unique identification number.
2. **Beneficial Ownership:** For legal entities, identify the natural person(s) who ultimately own or control the customer.
3. **Purpose and Nature:** Understand the purpose and intended nature of the business relationship.
4. **Ongoing Monitoring:** Conduct ongoing due diligence, including scrutiny of transactions and ensuring information is kept up-to-date.

### Enhanced Due Diligence (EDD)

Apply EDD for higher-risk scenarios:
- Politically Exposed Persons (PEPs) and their associates.
- Complex or unusually large transactions.
- Transactions involving high-risk jurisdictions.
- Customers using privacy-enhancing technologies.

### Simplified Due Diligence (SDD)

Permitted for lower-risk scenarios only when:
- The VASP has documented a risk assessment supporting the lower-risk determination.
- Ongoing monitoring is still maintained.
- SDD does not apply when there is suspicion of ML/TF.

## Suspicious Transaction Reporting

### Indicators of Suspicious Activity

VASPs should be alert to:
1. Structuring transactions to avoid thresholds (smurfing).
2. Rapid movement of funds through multiple addresses or VASPs.
3. Transactions that have no apparent economic purpose.
4. Use of mixing/tumbling services.
5. Transactions involving addresses linked to known illicit activity (e.g., sanctions lists, darknet markets).
6. Inconsistency between transaction patterns and stated purpose of the account.
7. Reluctance to provide required CDD information.

### Filing Obligations

- VASPs must file STRs with the relevant Financial Intelligence Unit (FIU) regardless of transaction amount.
- STRs should be filed "as soon as practicable" upon forming suspicion.
- Maintain internal policies, procedures, and training for suspicious activity identification.

## Sanctions Compliance

VASPs must:
1. Screen customers and transactions against UN, national, and regional sanctions lists.
2. Implement real-time screening for all transactions.
3. Freeze and report assets of designated persons and entities without delay.
4. Apply secondary sanctions screening where applicable (e.g., OFAC SDN list).

## Smart Contract Implications

For developers building on compliance-oriented chains like HashKey Chain:

1. **KYC Verification:** Integrate on-chain KYC checks (via HashKey KYC SBT) to ensure only verified users interact with regulated functions.
2. **Risk-Based Controls:** Implement tiered access based on KYC level (basic vs. advanced verification) to align with risk-based approach principles.
3. **Transaction Monitoring:** Emit comprehensive events to support off-chain monitoring systems.
4. **Sanctions Screening:** While real-time sanctions screening is typically off-chain, smart contracts can integrate with on-chain blacklists or oracle-based screening.
5. **Record-Keeping:** Ensure all on-chain actions are traceable and events contain sufficient data for compliance reporting.

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| FATF Recommendations | Recommendations 1, 10, 15, 16 (as applied to VAs) |
| FATF Updated Guidance on VAs/VASPs | October 2021 |
| FATF Interpretive Note to Rec. 15 | New technologies and VASPs |
| FATF 12-Month Review of VA/VASP Implementation | June 2020 |
| FATF Targeted Update on VAs/VASPs Implementation | June 2022 |

## Source

Financial Action Task Force. "Updated Guidance for a Risk-Based Approach to Virtual Assets and Virtual Asset Service Providers." October 2021. Available at https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Guidance-rba-virtual-assets-2021.html.
