# Emergency Pause Mechanism Pattern

## Problem

Regulated protocols must be able to halt operations in emergency situations: discovered vulnerabilities, regulatory orders, suspicious activity detection, or market disruptions. The SFC VATP guidelines and general smart contract security best practices require the ability to pause critical functions to protect user assets.

## Solution

Use OpenZeppelin's `Pausable` contract to implement an emergency pause mechanism. Apply the `whenNotPaused` modifier to all user-facing state-changing functions. Restrict pause/unpause to authorized roles.

### Basic Pausable Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract PausableProtocol is AccessControl, Pausable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(address admin, address guardian) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, guardian);
        _grantRole(PAUSER_ROLE, admin); // Admin can also pause
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Only admin can unpause (more restrictive than pause)
        _unpause();
    }

    // All user-facing functions check pause state
    function deposit() external payable whenNotPaused {
        // deposit logic
    }

    function withdraw(uint256 amount) external whenNotPaused {
        // withdrawal logic
    }

    // Admin functions may work even when paused
    function emergencyWithdraw(address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // Emergency recovery works even when paused
        (bool success,) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### Asymmetric Pause/Unpause Authority

A best practice for regulated protocols is to make pausing easier than unpausing:

- **Pause:** Can be triggered by the `PAUSER_ROLE` (guardian, monitoring bot, compliance officer).
- **Unpause:** Requires `DEFAULT_ADMIN_ROLE` (multi-sig) to prevent premature resumption.

This ensures that a single authorized party can quickly halt operations in an emergency, but resumption requires broader consensus.

### Automated Pause Triggers

For advanced implementations, integrate with monitoring systems:

```solidity
contract MonitoredProtocol is KYCGated, Pausable, ReentrancyGuard {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MONITOR_ROLE = keccak256("MONITOR_ROLE");

    uint256 public maxDailyVolume;
    uint256 public dailyVolume;
    uint256 public lastVolumeDay;

    event AutoPauseTriggered(uint256 volume, uint256 threshold, uint256 timestamp);

    function _trackVolume(uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;
        if (lastVolumeDay != today) {
            lastVolumeDay = today;
            dailyVolume = 0;
        }
        dailyVolume += amount;

        // Auto-pause if daily volume exceeds threshold
        if (dailyVolume > maxDailyVolume) {
            _pause();
            emit AutoPauseTriggered(dailyVolume, maxDailyVolume, block.timestamp);
        }
    }

    function withdraw(uint256 amount)
        external
        onlyVerifiedHuman
        whenNotPaused
        nonReentrant
    {
        _trackVolume(amount);
        // withdrawal logic
    }
}
```

### Partial Pause Pattern

Some protocols need to pause specific operations while keeping others active:

```solidity
contract PartiallyPausable is AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    bool public depositsPaused;
    bool public withdrawalsPaused;
    bool public tradingPaused;

    event DepositsPauseUpdated(bool paused);
    event WithdrawalsPauseUpdated(bool paused);
    event TradingPauseUpdated(bool paused);

    modifier whenDepositsNotPaused() {
        require(!depositsPaused, "Deposits paused");
        _;
    }

    modifier whenWithdrawalsNotPaused() {
        require(!withdrawalsPaused, "Withdrawals paused");
        _;
    }

    modifier whenTradingNotPaused() {
        require(!tradingPaused, "Trading paused");
        _;
    }

    function setDepositsPaused(bool paused) external onlyRole(PAUSER_ROLE) {
        depositsPaused = paused;
        emit DepositsPauseUpdated(paused);
    }

    function setWithdrawalsPaused(bool paused) external onlyRole(PAUSER_ROLE) {
        withdrawalsPaused = paused;
        emit WithdrawalsPauseUpdated(paused);
    }

    function setTradingPaused(bool paused) external onlyRole(PAUSER_ROLE) {
        tradingPaused = paused;
        emit TradingPauseUpdated(paused);
    }
}
```

## When to Use

- **Always** on regulated protocols that handle user funds.
- When the protocol must respond to regulatory orders to halt operations.
- When security monitoring detects anomalous activity.
- When a vulnerability is discovered and needs immediate mitigation.
- When market conditions require a trading halt.

## Related Regulations

| Regulation | Requirement |
|------------|-------------|
| SFC VATP Guidelines | Orderly market maintenance, ability to halt trading |
| Hong Kong AMLO | Regulatory intervention powers |
| EU MiCA Article 46 | CASP obligation to maintain orderly functioning |
| General security best practice | Circuit breaker pattern |

## Design Considerations

1. **What Should Still Work When Paused:** Decide which functions should remain active during a pause. Typically, read-only (view) functions and admin emergency functions should still work.
2. **Pause Duration:** Consider implementing a maximum pause duration to prevent indefinite lockups. However, for regulatory compliance, the ability to pause indefinitely may be necessary.
3. **Event Emission:** `Pausable` automatically emits `Paused(address account)` and `Unpaused(address account)` events.
4. **User Communication:** When paused, functions revert with the string "Pausable: paused" (or custom error in newer versions). Frontend applications should check the pause state and display appropriate messages.

## HashKey Chain Specific Considerations

1. **Guardian Model:** HashKey Chain itself uses a 3/5 multisig guardian with pause authority. Follow a similar model for your protocol.
2. **Safe Multi-sig:** Use HashKey Chain's Safe deployment (`multisig.hashkeychain.net`) for the `PAUSER_ROLE` to require multi-party consensus for pause/unpause decisions.
3. **Fast Response:** With 2-second block times on HashKey Chain, a pause transaction will be included quickly, minimizing the window between detecting an issue and halting operations.
4. **L2 Considerations:** If the HashKey Chain sequencer goes down, new transactions (including pause) cannot be submitted until it recovers or users submit through L1 force-inclusion (up to 12-hour delay). Plan for this edge case.

## Source

OpenZeppelin Pausable (v5.x). SFC VATP Guidelines. CompliBot contract patterns (`src/examples/CompliantVault.sol`).
