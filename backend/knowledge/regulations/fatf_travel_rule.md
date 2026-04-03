# FATF Travel Rule for Virtual Assets (Recommendation 16)

## Overview

The Financial Action Task Force (FATF) Recommendation 16, commonly known as the "Travel Rule," requires Virtual Asset Service Providers (VASPs) to obtain, hold, and transmit required originator and beneficiary information during virtual asset transfers. Originally developed for traditional wire transfers, the Travel Rule was extended to virtual assets in the June 2019 update to the FATF Standards.

## Core Requirements

### Recommendation 16 Key Provisions

When a VASP performs a virtual asset transfer on behalf of an originator, the ordering VASP must obtain and transmit the following information to the beneficiary VASP:

**Originator Information (Required):**
1. Name of the originator
2. Account number (e.g., wallet address) used to process the transaction
3. Physical address, national identity number, customer identification number, or date and place of birth

**Beneficiary Information (Required):**
1. Name of the beneficiary
2. Account number (e.g., wallet address) used to process the transaction

### Threshold Amount

- The Travel Rule applies to all virtual asset transfers above USD/EUR 1,000 (the de minimis threshold).
- For transfers below this threshold, only limited information may be required, though VASPs should still collect and verify originator/beneficiary names and account numbers.
- Some jurisdictions (e.g., the EU under MiCA/Transfer of Funds Regulation) have adopted a zero-threshold approach, requiring information for all transfers.

### Hong Kong Implementation

The AMLO requires licensed VATPs in Hong Kong to comply with the Travel Rule:

- **Threshold:** HKD 8,000 (approximately USD 1,000).
- **Required data for transfers above threshold:** Full originator and beneficiary information as specified above.
- **Required data for transfers below threshold:** Originator and beneficiary names and account numbers.
- **Record-keeping:** All Travel Rule data must be maintained for at least 5 years after the business relationship ends.

## VASP Obligations

### Ordering (Originator) VASP

1. **Collect Information:** Obtain required originator and beneficiary information before or at the time of the transfer.
2. **Verify Identity:** Verify the originator's identity using reliable data sources.
3. **Transmit Data:** Send originator and beneficiary information to the beneficiary VASP.
4. **Retain Records:** Store all information for the prescribed retention period.
5. **Risk Assessment:** Apply a risk-based approach to transactions that lack complete information.

### Beneficiary VASP

1. **Receive Data:** Obtain originator and beneficiary information from the ordering VASP.
2. **Verify Completeness:** Check that all required fields are present.
3. **Screen Information:** Screen originator and beneficiary information against sanctions lists and internal risk databases.
4. **Reject/Flag:** Reject or flag transfers with missing or incomplete information, applying a risk-based approach.
5. **Retain Records:** Maintain all received data for the prescribed retention period.

### Intermediary VASP

- Must ensure that all originator and beneficiary information accompanies the transfer throughout the payment chain.
- Must not alter or remove any information from the message.

## Technical Implementation Approaches

### On-Chain Solutions

Several protocols exist for implementing the Travel Rule on-chain:

1. **Event-Based Approach:** Emit structured events containing hashed Travel Rule data alongside transfers. Off-chain systems can verify and store the full data.
2. **Attestation-Based:** Use the Ethereum Attestation Service (EAS) or similar systems to create verifiable attestations of Travel Rule compliance.
3. **Registry-Based:** Maintain an on-chain registry that maps wallet addresses to VASP identifiers, enabling counterparty identification.

### Data Sharing Protocols

| Protocol | Type | Description |
|----------|------|-------------|
| TRISA | Decentralized P2P | Open-source protocol using mTLS for secure peer-to-peer Travel Rule data exchange |
| openVASP | Decentralized | Uses Ethereum smart contracts for VASP discovery and encrypted messaging |
| Sygna Bridge | Centralized Hub | Proprietary Travel Rule compliance platform |
| Notabene | SaaS | Travel Rule compliance platform with API integration |

## Smart Contract Patterns

For smart contracts on HashKey Chain, Travel Rule compliance can be implemented through:

### 1. Transaction Limit Checks
```solidity
uint256 public constant TRAVEL_RULE_THRESHOLD = 8000e18; // HKD 8,000 equivalent

modifier checkTravelRule(uint256 amount) {
    if (amount >= TRAVEL_RULE_THRESHOLD) {
        // Require that Travel Rule data has been submitted
        require(travelRuleDataSubmitted[msg.sender][currentTxId], "Travel Rule data required");
    }
    _;
}
```

### 2. Travel Rule Data Events
```solidity
event TravelRuleData(
    bytes32 indexed transferId,
    bytes32 originatorDataHash,
    bytes32 beneficiaryDataHash,
    uint256 amount,
    uint256 timestamp
);
```

### 3. Threshold-Based Routing
- Below threshold: standard transfer with basic KYC check.
- At or above threshold: require additional Travel Rule data submission before executing transfer.
- For very large transfers: require enhanced due diligence and potentially manual review.

## Penalties for Non-Compliance

- Monetary penalties imposed by the SFC or relevant financial regulator.
- Potential license revocation for repeated or serious violations.
- Reputational damage and potential loss of correspondent banking relationships.
- Criminal liability for facilitating ML/TF through willful non-compliance.

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| FATF Recommendation 16 | Wire Transfers (extended to VAs in 2019) |
| FATF Interpretive Note to Rec. 16 | Paragraphs 7(b) and 7(c) for VA transfers |
| FATF Guidance for a Risk-Based Approach to VAs and VASPs | Updated guidance, October 2021 |
| Hong Kong AMLO Schedule 2 | Travel Rule implementation for VATPs |
| EU Transfer of Funds Regulation (TFR) Recast | Zero-threshold Travel Rule for crypto (2024) |

## Source

Financial Action Task Force. "FATF Recommendations," updated periodically. "Updated Guidance for a Risk-Based Approach to Virtual Assets and Virtual Asset Service Providers," October 2021. Available at https://www.fatf-gafi.org.
