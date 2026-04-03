# EU Markets in Crypto-Assets Regulation (MiCA) Overview

## Overview

The Markets in Crypto-Assets Regulation (MiCA), formally Regulation (EU) 2023/1114, is the European Union's comprehensive regulatory framework for crypto-assets, crypto-asset issuers, and crypto-asset service providers (CASPs). MiCA entered into force on June 29, 2023, with stablecoin provisions applying from June 30, 2024, and full application (including CASP licensing) from December 30, 2024.

## Asset Classification

MiCA classifies crypto-assets into three categories:

### 1. Asset-Referenced Tokens (ARTs)
- Crypto-assets that maintain a stable value by referencing multiple currencies, commodities, or other crypto-assets.
- Example: A token backed by a basket of fiat currencies or gold.
- Issuers must be authorized by a competent authority in an EU Member State.
- Must maintain a reserve of assets backing the token at all times.
- White paper publication required before issuance.

### 2. E-Money Tokens (EMTs)
- Crypto-assets that maintain a stable value by referencing a single fiat currency.
- Example: USDC, USDT (when operating in the EU).
- Must be issued by an authorized credit institution or electronic money institution (EMI).
- Holders have a right to redeem at par value at any time.
- Reserve must be composed of secure, low-risk assets denominated in the referenced currency.
- A single EMT may not exceed a daily transaction volume of EUR 200 million (if not denominated in an EU currency).

### 3. Other Crypto-Assets (Utility Tokens, etc.)
- All crypto-assets that are not ARTs or EMTs.
- Includes utility tokens, governance tokens, and non-security crypto-assets.
- Lighter regulatory requirements: primarily a white paper obligation.
- No authorization required for issuance, but a white paper must be published and notified to the competent authority 20 working days before public offering.

## Issuer Requirements

### Asset-Referenced Token Issuers

| Requirement | Detail |
|-------------|--------|
| Authorization | Required from national competent authority |
| Own Funds | Minimum EUR 350,000 or 2% of average reserve assets (whichever is higher) |
| Reserve Assets | Must be held in custody by credit institutions or authorized crypto-asset custodians |
| White Paper | Must be approved by competent authority before publication |
| Governance | Robust governance arrangements, conflict of interest policies, business continuity |
| Redemption | Must offer redemption rights under clearly defined conditions |
| Significant ARTs | Additional requirements if designated as "significant" by EBA (> EUR 5 billion reserve or > 10 million holders) |

### E-Money Token Issuers

| Requirement | Detail |
|-------------|--------|
| Authorization | Must be an authorized credit institution or EMI |
| Redemption | Mandatory redemption at par value, at any time, at no charge |
| Reserve Investment | Must be placed in secure, low-risk assets in the referenced currency |
| White Paper | Required but not subject to prior approval |
| Interest Prohibition | EMT issuers cannot pay interest or provide any benefit related to holding EMTs |

## Crypto-Asset Service Provider (CASP) Rules

### Authorization

All CASPs must be authorized by a competent authority in an EU Member State. Authorized CASPs benefit from an EU-wide "passport" allowing them to provide services across all Member States.

### Covered Services

1. Custody and administration of crypto-assets on behalf of clients.
2. Operation of a trading platform for crypto-assets.
3. Exchange of crypto-assets for funds (fiat).
4. Exchange of crypto-assets for other crypto-assets.
5. Execution of orders for crypto-assets on behalf of clients.
6. Placing of crypto-assets.
7. Reception and transmission of orders for crypto-assets.
8. Providing advice on crypto-assets.
9. Portfolio management of crypto-assets.
10. Providing transfer services for crypto-assets on behalf of clients.

### Key CASP Obligations

- **Prudential Requirements:** Minimum own funds (higher of EUR 50,000-150,000 depending on services, or 1/4 of fixed overhead).
- **Conduct of Business:** Act honestly, fairly, and professionally in the best interest of clients.
- **Segregation of Assets:** Client crypto-assets and funds must be segregated from the CASP's own assets.
- **Complaint Handling:** Establish and maintain effective complaint-handling procedures.
- **Conflicts of Interest:** Identify, prevent, manage, and disclose conflicts of interest.
- **Outsourcing:** Robust policies for outsourcing critical functions.

### Market Abuse Provisions

MiCA introduces market abuse rules for crypto-assets:
- Prohibition of insider dealing, unlawful disclosure of inside information, and market manipulation.
- Applies to crypto-assets admitted to trading on a trading platform.
- Platforms must implement surveillance systems to detect and report suspicious orders and transactions.

## Transfer of Funds Regulation (TFR) Recast

Complementing MiCA, the recast TFR (Regulation (EU) 2023/1113) implements the FATF Travel Rule with a **zero-threshold** approach:
- Information on the originator and beneficiary must accompany all crypto-asset transfers, regardless of amount.
- CASPs must verify the accuracy of originator information before executing a transfer.
- For transfers to/from unhosted wallets above EUR 1,000, the CASP must verify whether the wallet belongs to the customer.

## Relevance to Smart Contract Developers

### Token Issuance

If you are creating a token on HashKey Chain that will be offered to EU residents:
1. Determine the classification (ART, EMT, or other crypto-asset).
2. Prepare a compliant white paper.
3. If ART or EMT: ensure the issuer is properly authorized.
4. Implement on-chain mechanisms for redemption if required.

### DeFi Protocols

- If a DeFi protocol has identifiable operators, it may fall under CASP rules.
- Implement KYC gates for EU-targeted services.
- Consider geographic restrictions (jurisdiction checks) for non-compliant regions.

### Transfer Compliance

- Implement Travel Rule data handling for all transfers (zero-threshold in EU).
- Emit events with sufficient metadata for off-chain compliance systems.

## Key Regulatory References

| Document | Reference |
|----------|-----------|
| Regulation (EU) 2023/1114 | MiCA (Markets in Crypto-Assets Regulation) |
| Regulation (EU) 2023/1113 | Transfer of Funds Regulation (Recast) |
| EBA Guidelines on ARTs and EMTs | Technical standards under MiCA |
| ESMA Technical Standards | For CASP authorization and market abuse |

## Source

European Parliament and Council. Regulation (EU) 2023/1114 of 31 May 2023 on markets in crypto-assets (MiCA). Official Journal of the European Union, L 150, 9.6.2023. Available at https://eur-lex.europa.eu.
