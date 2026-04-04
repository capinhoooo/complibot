# Timelock Pattern for Governance

## Problem

Critical protocol changes (parameter updates, upgrades, role changes) should not take effect immediately. Immediate changes create trust and security risks: a compromised admin key could instantly drain funds or alter protocol behavior. Regulated protocols need a time delay between proposing and executing changes, giving users and regulators time to review and react.

## Solution

Implement a timelock mechanism that enforces a minimum delay between when a change is proposed and when it can be executed. OpenZeppelin provides `TimelockController` for this purpose.

### Using OpenZeppelin TimelockController

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

// Deploy TimelockController as the admin of your protocol
// minDelay: minimum time between scheduling and execution (e.g., 24 hours)
// proposers: addresses that can schedule operations
// executors: addresses that can execute matured operations
// admin: optional admin for the timelock itself (set to address(0) to disable)

contract DeployTimelock {
    function deploy() external returns (TimelockController) {
        address[] memory proposers = new address[](1);
        proposers[0] = msg.sender; // multi-sig address

        address[] memory executors = new address[](1);
        executors[0] = msg.sender; // same multi-sig

        uint256 minDelay = 24 hours;

        return new TimelockController(
            minDelay,
            proposers,
            executors,
            address(0) // no additional admin
        );
    }
}
```

### Custom Timelock for Specific Parameters

For simpler use cases, implement a targeted timelock:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract TimelockAdmin is AccessControl {
    error TimelockNotExpired(uint256 currentTime, uint256 executeTime);
    error TimelockNotPending(bytes32 operationId);
    error TimelockAlreadyPending(bytes32 operationId);

    event OperationScheduled(
        bytes32 indexed operationId,
        uint256 executeAfter,
        bytes data
    );
    event OperationExecuted(bytes32 indexed operationId);
    event OperationCancelled(bytes32 indexed operationId);
    event TimelockDelayUpdated(uint256 oldDelay, uint256 newDelay);

    uint256 public timelockDelay;

    struct PendingOperation {
        uint256 executeAfter;
        bytes data;
        bool pending;
    }

    mapping(bytes32 => PendingOperation) public pendingOperations;

    constructor(uint256 delay) {
        timelockDelay = delay;
    }

    function scheduleOperation(bytes32 operationId, bytes calldata data)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (pendingOperations[operationId].pending) {
            revert TimelockAlreadyPending(operationId);
        }

        uint256 executeAfter = block.timestamp + timelockDelay;

        pendingOperations[operationId] = PendingOperation({
            executeAfter: executeAfter,
            data: data,
            pending: true
        });

        emit OperationScheduled(operationId, executeAfter, data);
    }

    function cancelOperation(bytes32 operationId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (!pendingOperations[operationId].pending) {
            revert TimelockNotPending(operationId);
        }

        delete pendingOperations[operationId];
        emit OperationCancelled(operationId);
    }

    modifier timelocked(bytes32 operationId) {
        PendingOperation storage op = pendingOperations[operationId];
        if (!op.pending) revert TimelockNotPending(operationId);
        if (block.timestamp < op.executeAfter) {
            revert TimelockNotExpired(block.timestamp, op.executeAfter);
        }
        _;
        delete pendingOperations[operationId];
        emit OperationExecuted(operationId);
    }

    function setTimelockDelay(uint256 newDelay)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 oldDelay = timelockDelay;
        timelockDelay = newDelay;
        emit TimelockDelayUpdated(oldDelay, newDelay);
    }
}
```

### Usage

```solidity
contract GovernedProtocol is KYCGated, TimelockAdmin {
    uint256 public feeRate;

    bytes32 public constant FEE_UPDATE_ID = keccak256("FEE_UPDATE");

    constructor(address kycAddress, uint256 delay)
        KYCGated(kycAddress)
        TimelockAdmin(delay)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Step 1: Schedule the fee update (starts the clock)
    function scheduleFeeUpdate(uint256 newFeeRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bytes32 opId = keccak256(abi.encode(FEE_UPDATE_ID, newFeeRate));
        // Schedule operation through parent
        this.scheduleOperation(opId, abi.encode(newFeeRate));
    }

    // Step 2: Execute after timelock expires
    function executeFeeUpdate(uint256 newFeeRate)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        timelocked(keccak256(abi.encode(FEE_UPDATE_ID, newFeeRate)))
    {
        feeRate = newFeeRate;
    }
}
```

## Recommended Delay Periods

| Operation Type | Recommended Delay | Rationale |
|---------------|-------------------|-----------|
| Fee changes | 24 hours | Users should have time to exit if fees become unfavorable |
| Parameter updates | 24 hours | Standard governance delay |
| Role changes | 48 hours | Higher sensitivity, needs review |
| Contract upgrades | 72 hours | Highest impact, maximum review time |
| Emergency parameters | 6 hours | Faster response needed but still reviewed |

## When to Use

- On all admin functions that change protocol parameters.
- On contract upgrade mechanisms (proxy admin changes).
- On role management for critical roles.
- When the protocol holds significant user funds that could be affected by parameter changes.
- When regulatory requirements mandate advance notice of protocol changes.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| SFC VATP Guidelines | Governance controls and change management |
| EU MiCA | Governance and internal control mechanisms |
| General security best practice | Minimize trust assumptions, provide exit windows |

## Design Considerations

1. **Emergency Override:** Consider a separate emergency path that bypasses the timelock for critical security responses (e.g., pause functionality). The timelock should not prevent emergency actions.
2. **Cancellation:** Always provide a way to cancel scheduled operations if the proposal is no longer appropriate.
3. **Transparency:** All scheduled operations should emit events so users and monitoring systems can detect upcoming changes.
4. **Minimum Delay:** The timelock delay itself should be subject to a minimum (e.g., 12 hours) to prevent the admin from setting it to zero and bypassing the mechanism.

## HashKey Chain Specific Considerations

1. **2-Second Block Time:** With fast blocks, the timelock precision is higher. A 24-hour delay will consistently be close to 24 hours (not dependent on 12-second block intervals).
2. **Note on HashKey Chain Governance:** HashKey Chain itself uses a 3/5 multisig with NO timelock for instant upgrades. This is a known centralization risk. For your own protocol, adding a timelock provides better trust guarantees to users.
3. **Safe Integration:** Use HashKey Chain's Safe multi-sig as the proposer/executor for the timelock, combining multi-party consensus with time delays.

## Source

OpenZeppelin TimelockController (v5.x). Governance best practices for DeFi protocols.
