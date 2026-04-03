# HashKey Chain KYC SBT Documentation

## Overview

HashKey Chain implements an on-chain Know Your Customer (KYC) system using non-transferable Soul-Bound Tokens (SBTs). This system allows smart contracts to verify user identity directly on-chain, enabling compliance-aware decentralized applications without exposing personal data. The KYC SBT is issued by HashKey Group, which holds SFC Type 1 and Type 7 licenses in Hong Kong.

## IHashKeyKYC Interface

The interface for interacting with the KYC SBT contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IHashKeyKYC {
    function isHuman(address account) external view returns (bool isValid, uint8 level);
    function getKycInfo(address account)
        external
        view
        returns (string memory ensName, uint8 level, uint8 status, uint256 createTime);
    function getTotalFee() external view returns (uint256);
    function requestKyc(string memory ensName) external payable;
    function isEnsNameApproved(address user, string memory ensName) external view returns (bool);
}
```

## Function Reference

### isHuman(address account)

The primary function for checking if an address has completed KYC verification.

**Parameters:**
- `account`: The address to check.

**Returns:**
- `isValid` (bool): Whether the account has a valid KYC verification (level > 0 and status is approved).
- `level` (uint8): The KYC verification level (0-4).

**Usage:**
```solidity
(bool isValid, uint8 level) = kycContract.isHuman(userAddress);
require(isValid, "KYC verification required");
```

**Gas Cost:** View function, no gas cost when called externally. Costs gas when called from a contract during a transaction.

### getKycInfo(address account)

Returns detailed KYC information for an address.

**Parameters:**
- `account`: The address to query.

**Returns:**
- `ensName` (string): The ENS name associated with the KYC (HashKey-issued ENS).
- `level` (uint8): Verification level (0-4).
- `status` (uint8): Verification status (0 = NONE, 1 = APPROVED, 2 = REVOKED).
- `createTime` (uint256): Unix timestamp when the KYC was created.

**Usage:**
```solidity
(string memory ensName, uint8 level, uint8 status, uint256 createTime) =
    kycContract.getKycInfo(userAddress);
require(status == 1, "KYC not approved");
require(level >= 2, "Advanced KYC required");
```

### getTotalFee()

Returns the total fee (in HSK) required to request KYC verification.

**Returns:**
- `uint256`: Fee amount in wei (HSK has 18 decimals).

### requestKyc(string memory ensName)

Initiates a KYC verification request. Must send the fee amount returned by `getTotalFee()`.

**Parameters:**
- `ensName`: The desired ENS name to associate with the KYC.

**Notes:**
- This is a `payable` function; the caller must send the required fee in HSK.
- After calling, the user must complete off-chain KYC verification through HashKey's platform.
- The SBT is issued upon successful verification.

### isEnsNameApproved(address user, string memory ensName)

Checks if a specific ENS name has been approved for a user address.

**Parameters:**
- `user`: The address to check.
- `ensName`: The ENS name to verify.

**Returns:**
- `bool`: Whether the ENS name is approved for this address.

## Verification Levels

| Level | Value | Description | Typical Requirements |
|-------|-------|-------------|----------------------|
| NONE | 0 | No verification | N/A |
| BASIC | 1 | Basic-level verification | Email, phone number |
| ADVANCED | 2 | Advanced-level verification | Government ID, selfie |
| PREMIUM | 3 | Premium-level verification | Enhanced documentation, proof of address |
| ULTIMATE | 4 | Ultimate-level verification | Full institutional-grade verification |

## KYC Status Values

| Status | Value | Description |
|--------|-------|-------------|
| NONE | 0 | Default state, no KYC record |
| APPROVED | 1 | KYC verification approved and active |
| REVOKED | 2 | KYC verification revoked by administrator |

## Integration Guide

### Step 1: Import the Interface

```solidity
import {IHashKeyKYC} from "./interfaces/IHashKeyKYC.sol";
```

### Step 2: Store the KYC Contract Reference

```solidity
IHashKeyKYC public kycContract;

constructor(address kycContractAddress) {
    kycContract = IHashKeyKYC(kycContractAddress);
}
```

### Step 3: Create a KYC Modifier

```solidity
modifier onlyVerifiedHuman() {
    (bool isValid, ) = kycContract.isHuman(msg.sender);
    require(isValid, "KYC verification required");
    _;
}
```

### Step 4: Create a Level-Based Modifier

```solidity
modifier onlyMinKycLevel(uint8 minLevel) {
    (bool isValid, uint8 level) = kycContract.isHuman(msg.sender);
    require(isValid, "KYC verification required");
    require(level >= minLevel, "Insufficient KYC level");
    _;
}
```

### Step 5: Apply Modifiers to Functions

```solidity
function deposit() external payable onlyVerifiedHuman {
    // Only KYC-verified users can deposit
}

function largeTrade(uint256 amount) external onlyMinKycLevel(2) {
    // Only Advanced+ KYC users can make large trades
}
```

## Using the KYCGated Base Contract

CompliBot provides a reusable abstract base contract that encapsulates KYC integration:

```solidity
import {KYCGated} from "./base/KYCGated.sol";

contract MyProtocol is KYCGated {
    constructor(address kycContract_) KYCGated(kycContract_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function protectedAction() external onlyVerifiedHuman {
        // KYC-gated logic
    }

    function premiumAction() external onlyMinKycLevel(3) {
        // Requires Premium KYC
    }
}
```

The `KYCGated` base contract provides:
- `onlyVerifiedHuman` modifier: requires `isHuman` returns true.
- `onlyMinKycLevel(uint8)` modifier: requires both valid KYC and minimum level.
- `setKycContract(address)` function: admin-only function to update the KYC contract address.
- Custom errors: `KYCNotVerified`, `KYCInsufficientLevel`, `KYCContractZeroAddress`.
- Inherits from `AccessControl` for role-based access management.

## Soul-Bound Token Properties

- **Non-Transferable:** KYC SBTs cannot be transferred between addresses. They are permanently bound to the verified address.
- **Revocable:** The KYC administrator can revoke a user's verification (setting status to REVOKED).
- **Restorable:** A revoked KYC can be restored by the administrator.
- **One Per Address:** Each address can have at most one KYC SBT.
- **Privacy-Preserving:** Personal data is not stored on-chain. Only the verification status, level, and associated ENS name are accessible.

## Events

The KYC SBT contract emits the following events:

```solidity
event KycRequested(address indexed user, string ensName);
event KycLevelUpdated(address indexed user, uint8 level);
event KycStatusUpdated(address indexed user, uint8 status);
event KycRevoked(address indexed user);
event KycRestored(address indexed user);
event AddressApproved(address indexed user);
event EnsNameApproved(address indexed user, string ensName);
```

## Frontend Integration

Using viem to check KYC status:

```typescript
import { createPublicClient, http } from "viem";
import { hashkey } from "viem/chains";

const KYC_ABI = [
  {
    name: "isHuman",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "isValid", type: "bool" },
      { name: "level", type: "uint8" },
    ],
  },
] as const;

const client = createPublicClient({
  chain: hashkey,
  transport: http("https://mainnet.hsk.xyz"),
});

async function checkKYC(kycContractAddress: `0x${string}`, userAddress: `0x${string}`) {
  const [isValid, level] = await client.readContract({
    address: kycContractAddress,
    abi: KYC_ABI,
    functionName: "isHuman",
    args: [userAddress],
  });
  return { isValid, level };
}
```

## Important Notes

1. **Contract Address Discovery:** The deployed KYC SBT contract address is not prominently listed in the official HashKey Chain documentation. Check the Blockscout explorer at `https://hashkey.blockscout.com` or contact the HashKey Chain team.
2. **Gas Considerations:** `isHuman` and `getKycInfo` are view functions and cost no gas when called externally. However, when called from within a transaction (e.g., inside a modifier), they consume gas for the CALL opcode.
3. **Testnet vs Mainnet:** The KYC SBT contract addresses differ between testnet (Chain ID 133) and mainnet (Chain ID 177). Use the appropriate address for your target network.
4. **Upgradeability:** The KYC SBT contract address may change if the contract is upgraded. Use the `setKycContract` function in the `KYCGated` base to update references.

## Source

HashKey Chain Documentation. "KYC SBT System." Available at https://docs.hashkeychain.net/docs/Build-on-HashKey-Chain/Tools/KYC.
