# Hong Kong AML/CFT Requirements for Virtual Assets

## Overview

Hong Kong's Anti-Money Laundering and Counter-Terrorist Financing (AML/CFT) framework for virtual assets is primarily governed by the Anti-Money Laundering and Counter-Terrorist Financing Ordinance (AMLO), Cap. 615. Part 5A of the AMLO, which took effect on June 1, 2023, establishes the licensing regime for Virtual Asset Trading Platforms (VATPs) and imposes AML/CFT obligations on them.

## AMLO Requirements for VATPs

### Licensing Obligation (Section 53ZRD)

- Any person who operates a virtual asset exchange in Hong Kong, or actively markets such exchange services to Hong Kong public, must hold a license granted by the SFC.
- Operating without a license is a criminal offense carrying a maximum penalty of HKD 5 million fine and 7 years imprisonment.

### Customer Due Diligence (Schedule 2)

#### When CDD Must Be Performed

1. Before establishing a business relationship with a customer.
2. Before carrying out an occasional transaction at or above HKD 8,000 (or its equivalent in virtual assets).
3. When there is suspicion of ML/TF, regardless of transaction amount or any exemption.
4. When there is doubt about the veracity or adequacy of previously obtained CDD information.

#### Standard CDD Measures

| Requirement | Description |
|-------------|-------------|
| Identity Verification (Individual) | Full name, date of birth, residential address, unique identification number (HKID, passport number) |
| Identity Verification (Corporate) | Full name, certificate of incorporation, place of incorporation, registered office address, directors/principals, beneficial owners |
| Beneficial Ownership | Identify natural person(s) who ultimately own > 25% or exercise control; if none identified, identify senior managing official |
| Purpose of Relationship | Obtain information on the purpose and intended nature of the business relationship |
| Source of Funds | Understand the source of funds for higher-risk customers |
| Ongoing Monitoring | Conduct ongoing monitoring of the business relationship, including scrutiny of transactions |

#### Enhanced CDD Situations

Enhanced CDD must be applied when:
- The customer or beneficial owner is a PEP (Politically Exposed Person) or family member/close associate of a PEP.
- The customer is from or the transaction involves a jurisdiction identified as higher risk.
- The transaction is complex, unusually large, or has no apparent economic or lawful purpose.
- There is a higher risk of ML/TF for any other reason.
- The VATP relies on a third party for CDD.

#### Simplified CDD

Simplified CDD may be applied only when:
- The VATP has assessed a lower ML/TF risk.
- The customer is a regulated financial institution or listed company in Hong Kong.
- Ongoing monitoring is still maintained.

### Record-Keeping (Section 25A)

| Record Type | Retention Period |
|-------------|-----------------|
| CDD records (identity, verification, account files) | 6 years after the end of the business relationship |
| Transaction records | 6 years after the transaction is completed |
| STR records and supporting documentation | 6 years from the date of the STR |
| Internal compliance reports | 6 years from the date of the report |

All records must be sufficient to permit reconstruction of individual transactions so as to provide evidence for prosecution of criminal activity.

### Suspicious Transaction Reporting

#### Filing Obligations

Under Section 25 of the Organized and Serious Crimes Ordinance (OSCO) and Section 25A of the Drug Trafficking (Recovery of Proceeds) Ordinance (DTROP):

- Any person who knows or suspects that property is the proceeds of, or is connected to, an indictable offense must file a report with the Joint Financial Intelligence Unit (JFIU).
- Failure to report is a criminal offense: maximum penalty of HKD 50,000 fine and 3 months imprisonment.
- Tipping off (alerting a customer that an STR has been filed) is also a criminal offense: maximum penalty of HKD 500,000 fine and 3 years imprisonment.

#### Red Flags for Virtual Asset Transactions

1. Unusually high-value transactions inconsistent with customer's profile.
2. Rapid movement of virtual assets through multiple wallets or exchanges.
3. Transactions involving known mixer/tumbler services.
4. Transfers to/from wallets associated with sanctioned entities or darknet markets.
5. Structuring transactions to avoid reporting thresholds.
6. Customer provides false or inconsistent identification information.
7. Reluctance to provide source of funds information.
8. Transaction patterns suggesting layering (moving assets through complex chains to obscure origin).

### Wire Transfer / Travel Rule Requirements

Under Schedule 2, Division 5 of the AMLO:

**For transfers at or above HKD 8,000:**
- Full originator information: name, account number (wallet address), address or national identity number or date and place of birth.
- Full beneficiary information: name, account number (wallet address).
- All information must accompany the transfer.

**For transfers below HKD 8,000:**
- Originator name and account number.
- Beneficiary name and account number.
- Information need not accompany the transfer but must be available upon request within 3 business days.

### Compliance Organization

VATPs must:
1. Appoint a Compliance Officer at management level (Money Laundering Reporting Officer / MLRO).
2. Establish internal policies, procedures, and controls for AML/CFT.
3. Implement an independent audit function to test the AML/CFT program.
4. Provide ongoing AML/CFT training to staff.
5. Establish employee screening procedures.

## Smart Contract Implementation Guidance

### On-Chain AML Compliance Patterns

1. **KYC Gate:** Use HashKey Chain's KYC SBT to restrict function access to verified users only. This satisfies the CDD requirement by leveraging HashKey's licensed KYC infrastructure.

2. **Transaction Limits:** Implement per-transaction limits (e.g., HKD 8,000 Travel Rule threshold) and daily aggregate limits to support monitoring.

3. **Event Emissions:** Emit structured events for all value transfers to support off-chain STR monitoring:
```solidity
event ComplianceTransfer(
    address indexed from,
    address indexed to,
    uint256 amount,
    uint256 timestamp,
    bytes32 referenceId
);
```

4. **Blacklist/Sanctions:** Integrate with on-chain or oracle-based sanctions lists to block transactions involving sanctioned addresses.

5. **Pause Mechanism:** Implement emergency pause to freeze operations when suspicious activity is detected.

6. **Access Control:** Role-based access for compliance functions (COMPLIANCE_ROLE for updating blacklists, ADMIN_ROLE for pause/unpause).

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| Anti-Money Laundering and Counter-Terrorist Financing Ordinance (AMLO), Cap. 615 | Part 5A (VATP licensing), Schedule 2 (CDD) |
| Organized and Serious Crimes Ordinance (OSCO), Cap. 455 | Section 25 (STR obligation) |
| Drug Trafficking (Recovery of Proceeds) Ordinance (DTROP), Cap. 405 | Section 25A (STR obligation) |
| SFC AML/CTF Guideline | For Licensed Corporations and SFC-Licensed VATPs |
| HKMA Guidance on AML/CFT | Supplementary guidance for financial institutions |

## Source

Hong Kong Special Administrative Region. Anti-Money Laundering and Counter-Terrorist Financing Ordinance, Cap. 615. Available at https://www.elegislation.gov.hk. SFC Guideline on Anti-Money Laundering and Counter-Terrorist Financing. Available at https://www.sfc.hk.
