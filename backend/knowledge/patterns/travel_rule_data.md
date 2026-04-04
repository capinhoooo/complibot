# Travel Rule Data Attachment Pattern

## Problem

The FATF Travel Rule (Recommendation 16) requires that originator and beneficiary information accompany virtual asset transfers above certain thresholds. Smart contracts need a mechanism to attach Travel Rule data to transfers without storing personal information on-chain. The challenge is linking off-chain identity data with on-chain transactions in a verifiable, privacy-preserving manner.

## Solution

Implement a Travel Rule data submission system that accepts hashed identity data alongside transfers. The actual personal data is stored off-chain, while the hash provides an on-chain commitment that the data exists and can be verified.

### Travel Rule Data Attachment

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract TravelRuleCompliant is AccessControl {
    error TravelRuleDataRequired(uint256 amount, uint256 threshold);
    error TravelRuleDataAlreadySubmitted(bytes32 transferId);
    error InvalidTravelRuleData();

    event TravelRuleDataSubmitted(
        bytes32 indexed transferId,
        address indexed originator,
        address indexed beneficiary,
        bytes32 originatorDataHash,
        bytes32 beneficiaryDataHash,
        uint256 amount,
        uint256 timestamp
    );

    event TravelRuleDataVerified(
        bytes32 indexed transferId,
        address indexed verifier,
        uint256 timestamp
    );

    struct TravelRuleRecord {
        bytes32 originatorDataHash;
        bytes32 beneficiaryDataHash;
        uint256 amount;
        uint256 timestamp;
        bool verified;
    }

    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    uint256 public travelRuleThreshold;
    mapping(bytes32 => TravelRuleRecord) public travelRuleRecords;
    mapping(bytes32 => bool) public travelRuleDataExists;

    modifier requiresTravelRuleData(
        bytes32 transferId,
        address beneficiary,
        uint256 amount
    ) {
        if (amount >= travelRuleThreshold) {
            if (!travelRuleDataExists[transferId]) {
                revert TravelRuleDataRequired(amount, travelRuleThreshold);
            }
        }
        _;
    }

    /// @notice Submit Travel Rule data before executing a transfer
    /// @param transferId Unique identifier for the transfer
    /// @param beneficiary The recipient address
    /// @param originatorDataHash Hash of originator identity data (name, address, ID number)
    /// @param beneficiaryDataHash Hash of beneficiary identity data (name, account number)
    /// @param amount The transfer amount
    function submitTravelRuleData(
        bytes32 transferId,
        address beneficiary,
        bytes32 originatorDataHash,
        bytes32 beneficiaryDataHash,
        uint256 amount
    ) external {
        if (originatorDataHash == bytes32(0) || beneficiaryDataHash == bytes32(0)) {
            revert InvalidTravelRuleData();
        }
        if (travelRuleDataExists[transferId]) {
            revert TravelRuleDataAlreadySubmitted(transferId);
        }

        travelRuleRecords[transferId] = TravelRuleRecord({
            originatorDataHash: originatorDataHash,
            beneficiaryDataHash: beneficiaryDataHash,
            amount: amount,
            timestamp: block.timestamp,
            verified: false
        });

        travelRuleDataExists[transferId] = true;

        emit TravelRuleDataSubmitted(
            transferId,
            msg.sender,
            beneficiary,
            originatorDataHash,
            beneficiaryDataHash,
            amount,
            block.timestamp
        );
    }

    /// @notice Compliance officer verifies Travel Rule data
    function verifyTravelRuleData(bytes32 transferId)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        TravelRuleRecord storage record = travelRuleRecords[transferId];
        record.verified = true;

        emit TravelRuleDataVerified(transferId, msg.sender, block.timestamp);
    }

    function setTravelRuleThreshold(uint256 newThreshold)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        travelRuleThreshold = newThreshold;
    }
}
```

### Two-Step Transfer with Travel Rule

```solidity
contract CompliantTransfer is KYCGated, TravelRuleCompliant, ReentrancyGuard {
    using SafeERC20 for IERC20;

    constructor(address kycAddress, uint256 threshold) KYCGated(kycAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
        travelRuleThreshold = threshold;
    }

    /// @notice Step 1: Submit Travel Rule data (for transfers >= threshold)
    /// @notice Step 2: Execute the transfer

    function executeTransfer(
        bytes32 transferId,
        address token,
        address beneficiary,
        uint256 amount
    )
        external
        onlyVerifiedHuman
        requiresTravelRuleData(transferId, beneficiary, amount)
        nonReentrant
    {
        IERC20(token).safeTransferFrom(msg.sender, beneficiary, amount);
    }
}
```

### Off-Chain Data Hashing (TypeScript)

```typescript
import { keccak256, encodePacked, toHex } from "viem";

interface OriginatorData {
  name: string;
  address: string;
  idNumber: string;
  dateOfBirth: string;
}

interface BeneficiaryData {
  name: string;
  accountNumber: string; // wallet address
}

function hashOriginatorData(data: OriginatorData): `0x${string}` {
  return keccak256(
    encodePacked(
      ["string", "string", "string", "string"],
      [data.name, data.address, data.idNumber, data.dateOfBirth]
    )
  );
}

function hashBeneficiaryData(data: BeneficiaryData): `0x${string}` {
  return keccak256(
    encodePacked(
      ["string", "string"],
      [data.name, data.accountNumber]
    )
  );
}

// Usage: hash data off-chain, submit hashes on-chain
const originatorHash = hashOriginatorData({
  name: "John Doe",
  address: "123 Main St, Hong Kong",
  idNumber: "A1234567",
  dateOfBirth: "1990-01-15",
});

const beneficiaryHash = hashBeneficiaryData({
  name: "Jane Smith",
  accountNumber: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD30",
});
```

### EAS-Based Travel Rule Attestation (Alternative)

For higher assurance, use the Ethereum Attestation Service to create verifiable Travel Rule attestations:

```solidity
// Create an EAS attestation with Travel Rule data hashes
// EAS is available at 0x4200000000000000000000000000000000000021 on HashKey Chain
bytes memory attestationData = abi.encode(
    transferId,
    originatorDataHash,
    beneficiaryDataHash,
    amount,
    block.timestamp
);

// The attestation provides a permanent, verifiable on-chain record
```

## Data Requirements by Threshold

| Threshold | Originator Data | Beneficiary Data | Source |
|-----------|----------------|-------------------|--------|
| < HKD 8,000 | Name, account number | Name, account number | HK AMLO |
| >= HKD 8,000 | Full: name, account, address/ID/DOB | Full: name, account | HK AMLO |
| Any amount (EU) | Full originator + beneficiary info | Full beneficiary info | EU TFR (zero threshold) |
| >= USD 3,000 | Full originator info | Full beneficiary info | US FinCEN |

## When to Use

- On all transfer functions where the protocol operates across VASPs.
- When the protocol facilitates transfers between identified users (VASP-to-VASP).
- When serving users in jurisdictions with Travel Rule requirements.
- When the protocol handles stablecoins or tokens representing fiat value.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| FATF Recommendation 16 | Travel Rule for virtual asset transfers |
| Hong Kong AMLO Schedule 2, Division 5 | Wire transfer requirements for VATPs |
| EU Transfer of Funds Regulation (Recast) | Zero-threshold Travel Rule |
| US FinCEN Travel Rule | USD 3,000 threshold |

## Design Considerations

1. **Privacy:** Never store personal data on-chain. Only store hashes. The off-chain system (backend database) stores the actual originator and beneficiary data and can produce it for regulatory audits.
2. **Hash Verification:** The hash allows a regulator or auditor to verify that specific off-chain data matches the on-chain commitment by recomputing the hash.
3. **Two-Step Flow:** For a smooth UX, the frontend can submit Travel Rule data and execute the transfer in the same transaction batch, or submit data first and execute in a follow-up transaction.
4. **Threshold Dynamism:** The threshold may change across jurisdictions. Make it configurable via `setTravelRuleThreshold`.

## HashKey Chain Specific Considerations

1. **HSK Value Conversion:** For native HSK transfers, convert the threshold to HSK equivalent using the APRO HSK/USD oracle feed.
2. **EAS Integration:** HashKey Chain's EAS predeploy at `0x4200000000000000000000000000000000000021` can be used to create persistent Travel Rule attestations that survive beyond event logs.
3. **HashKey VASP Status:** As HashKey Group itself is a VASP, protocols on HashKey Chain may coordinate Travel Rule data exchange through HashKey's compliance infrastructure.

## Source

FATF Recommendation 16. Hong Kong AMLO Schedule 2, Division 5. TRISA and openVASP Travel Rule protocol specifications.
