# Reentrancy Protection Pattern

## Problem

Reentrancy is one of the most critical smart contract vulnerabilities. It occurs when an external call allows the called contract to re-enter the calling function before the first execution completes. This can lead to state manipulation, fund drainage, and loss of assets. The DAO hack (2016) is the most infamous example, resulting in a $60 million loss.

## Solution

Use OpenZeppelin's `ReentrancyGuard` to prevent reentrant calls. Apply the `nonReentrant` modifier to all functions that perform external calls or transfer value. Additionally, follow the Checks-Effects-Interactions (CEI) pattern as a defense-in-depth measure.

### Using OpenZeppelin ReentrancyGuard

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SecureVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => uint256) public balances;

    // CORRECT: nonReentrant + CEI pattern
    function withdraw(uint256 amount) external nonReentrant {
        // CHECKS
        uint256 balance = balances[msg.sender];
        require(amount <= balance, "Insufficient balance");

        // EFFECTS (state update BEFORE external call)
        balances[msg.sender] = balance - amount;

        // INTERACTIONS (external call LAST)
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### Vulnerable Pattern (DO NOT USE)

```solidity
// VULNERABLE: No reentrancy protection, state update after external call
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // External call BEFORE state update = reentrancy vulnerability
    payable(msg.sender).transfer(amount);

    // State update happens after external call
    // An attacker can re-enter withdraw() before this line executes
    balances[msg.sender] -= amount;
}
```

### Why `.transfer()` and `.send()` Are Not Safe

Historically, `.transfer()` and `.send()` were considered safe because they forward only 2,300 gas, which was insufficient for a reentrant call. However:

1. **EIP-1884 changed gas costs:** Storage operations became more expensive, but the 2,300 gas stipend did not change, potentially breaking contracts that rely on it.
2. **Gas repricing risk:** Future EVM changes could further alter gas costs.
3. **Non-portable:** The 2,300 gas limit is an Ethereum-specific assumption that may not hold on all EVM chains.
4. **Best practice:** Always use `.call{value: amount}("")` with `ReentrancyGuard` instead.

```solidity
// DO NOT USE
payable(msg.sender).transfer(amount); // Limited to 2,300 gas, fragile
payable(msg.sender).send(amount);     // Same issue, also returns bool

// USE INSTEAD
(bool success,) = msg.sender.call{value: amount}("");
require(success, "Transfer failed");
```

### Checks-Effects-Interactions (CEI) Pattern

Even with `ReentrancyGuard`, follow CEI as a defense-in-depth strategy:

```
1. CHECKS:      Validate all inputs and conditions
2. EFFECTS:     Update all state variables
3. INTERACTIONS: Make external calls (transfers, contract calls)
```

```solidity
function withdrawToken(address token, uint256 amount) external nonReentrant {
    // 1. CHECKS
    if (amount == 0) revert ZeroAmount();
    uint256 balance = tokenBalances[msg.sender][token];
    if (amount > balance) revert InsufficientBalance(amount, balance);

    // 2. EFFECTS
    tokenBalances[msg.sender][token] = balance - amount;

    // 3. INTERACTIONS
    emit Withdrawn(msg.sender, token, amount);
    IERC20(token).safeTransfer(msg.sender, amount);
}
```

### Using SafeERC20

Always use `SafeERC20` for ERC-20 token interactions to handle tokens that do not return a boolean value:

```solidity
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    function deposit(address token, uint256 amount) external nonReentrant {
        // SafeERC20 handles non-standard tokens (no return value, etc.)
        uint256 before = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = IERC20(token).balanceOf(address(this)) - before;
        // Use `received` instead of `amount` to handle fee-on-transfer tokens
    }
}
```

## When to Use

- **Always** on functions that transfer native currency (HSK on HashKey Chain).
- **Always** on functions that transfer ERC-20 tokens.
- **Always** on functions that make external calls to untrusted contracts.
- **Always** on functions that implement callback patterns (e.g., flash loans).
- **Recommended** on any function that modifies state and could be called in an unexpected context.

## Related Regulations

| Regulation | Relevance |
|------------|-----------|
| SFC VATP Guidelines | Platforms must implement security controls to protect client assets |
| Hong Kong AMLO | Asset security and segregation requirements |
| General smart contract security | OWASP Smart Contract Top 10, SWC-107 |

## Common Mistakes

1. **Forgetting `nonReentrant` on one function:** If a contract has multiple withdrawal paths, ALL must be protected.
2. **Read-only reentrancy:** Some view functions that read from external contracts can be exploited if the external contract is in a partially-updated state during a reentrant call. Consider this for pricing oracles and lending protocols.
3. **Cross-contract reentrancy:** If Contract A calls Contract B, and Contract B calls back to Contract A through a different function, single-contract `ReentrancyGuard` may not catch it. Use transient storage locks (EIP-1153) for cross-function protection on supported chains.

## HashKey Chain Specific Considerations

1. **HSK Native Transfers:** When transferring HSK (the native token), always use `call{value: amount}("")` with `nonReentrant`. Never use `transfer()` or `send()`.
2. **Low Gas Costs:** The `ReentrancyGuard` adds approximately 2,100 gas per guarded call (SSTORE for the lock). On HashKey Chain's low-fee L2, this is negligible.
3. **OP Stack Compatibility:** `ReentrancyGuard` works identically on HashKey Chain as on Ethereum mainnet. No OP Stack-specific modifications needed.

## Source

OpenZeppelin ReentrancyGuard (v5.x). Solidity Security Best Practices. SWC-107 Reentrancy. CompliBot CompliantVault example (`src/examples/CompliantVault.sol`).
