// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {KYCGated} from "../base/KYCGated.sol";

contract CompliantVault is KYCGated, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance(uint256 requested, uint256 available);
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error TransferFailed();
    error LimitTooLow();

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event NativeDeposited(address indexed user, uint256 amount);
    event NativeWithdrawn(address indexed user, uint256 amount);
    event TransactionLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);


    mapping(address => mapping(address => uint256)) public tokenBalances;
    mapping(address => uint256) public nativeBalances;
    mapping(address => uint256) private _dailyWithdrawn;
    mapping(address => uint256) private _lastWithdrawalDay;

    uint256 public transactionLimit;
    uint256 public dailyLimit;

    constructor(
        address admin,
        address kycContract_,
        uint256 transactionLimit_,
        uint256 dailyLimit_
    ) KYCGated(kycContract_) {
        if (admin == address(0)) revert ZeroAddress();
        if (transactionLimit_ == 0) revert LimitTooLow();
        if (dailyLimit_ == 0) revert LimitTooLow();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        transactionLimit = transactionLimit_;
        dailyLimit = dailyLimit_;
    }

    function deposit(address token, uint256 amount)
        external
        onlyVerifiedHuman
        whenNotPaused
        nonReentrant
    {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = IERC20(token).balanceOf(address(this)) - balanceBefore;

        tokenBalances[msg.sender][token] += received;

        emit Deposited(msg.sender, token, received);
    }

    function depositNative()
        external
        payable
        onlyVerifiedHuman
        whenNotPaused
        nonReentrant
    {
        if (msg.value == 0) revert ZeroAmount();
        if (msg.value > transactionLimit) {
            revert ExceedsTransactionLimit(msg.value, transactionLimit);
        }

        nativeBalances[msg.sender] += msg.value;

        emit NativeDeposited(msg.sender, msg.value);
    }

    function withdraw(address token, uint256 amount)
        external
        onlyVerifiedHuman
        whenNotPaused
        nonReentrant
    {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        _checkDailyLimit(amount);

        uint256 balance = tokenBalances[msg.sender][token];
        if (amount > balance) revert InsufficientBalance(amount, balance);

        tokenBalances[msg.sender][token] = balance - amount;

        emit Withdrawn(msg.sender, token, amount);

        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function withdrawNative(uint256 amount)
        external
        onlyVerifiedHuman
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        _checkDailyLimit(amount);

        uint256 balance = nativeBalances[msg.sender];
        if (amount > balance) revert InsufficientBalance(amount, balance);

        nativeBalances[msg.sender] = balance - amount;

        emit NativeWithdrawn(msg.sender, amount);

        (bool success,) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function setTransactionLimit(uint256 newLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newLimit == 0) revert LimitTooLow();
        uint256 oldLimit = transactionLimit;
        transactionLimit = newLimit;
        emit TransactionLimitUpdated(oldLimit, newLimit);
    }

    function setDailyLimit(uint256 newLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newLimit == 0) revert LimitTooLow();
        uint256 oldLimit = dailyLimit;
        dailyLimit = newLimit;
        emit DailyLimitUpdated(oldLimit, newLimit);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _checkDailyLimit(uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;

        if (_lastWithdrawalDay[msg.sender] != today) {
            _lastWithdrawalDay[msg.sender] = today;
            _dailyWithdrawn[msg.sender] = 0;
        }

        uint256 remaining = dailyLimit - _dailyWithdrawn[msg.sender];
        if (amount > remaining) revert ExceedsDailyLimit(amount, remaining);

        _dailyWithdrawn[msg.sender] += amount;
    }
}
