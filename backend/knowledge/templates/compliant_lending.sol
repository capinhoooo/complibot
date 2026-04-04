// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CompliantLending
 * @notice A regulation-compliant lending protocol for HashKey Chain.
 *
 * Compliance features:
 * - KYC gate via HashKey KYC SBT (borrowers and lenders)
 * - AML blacklist screening
 * - Per-transaction and daily limits (FATF Travel Rule)
 * - Collateral management with liquidation
 * - Role-based access control
 * - Emergency pause
 * - Reentrancy protection
 * - Regulatory event emissions
 *
 * Built for: HashKey Chain (Chain ID 177, OP Stack L2)
 * Solidity: 0.8.24 | OpenZeppelin: v5.x
 */

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IHashKeyKYC} from "../interfaces/IHashKeyKYC.sol";

contract CompliantLending is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------
    error KYCNotVerified(address account);
    error KYCInsufficientLevel(address account, uint8 required, uint8 actual);
    error KYCContractZeroAddress();
    error AddressBlacklisted(address account);
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance(uint256 requested, uint256 available);
    error InsufficientCollateral(uint256 required, uint256 provided);
    error LoanAlreadyExists(address borrower);
    error NoActiveLoan(address borrower);
    error LoanNotLiquidatable(address borrower);
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error LimitTooLow();
    error InvalidCollateralRatio();
    error InvalidInterestRate();

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------
    event Deposited(address indexed lender, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed lender, uint256 amount, uint256 timestamp);
    event LoanCreated(
        address indexed borrower,
        uint256 collateral,
        uint256 borrowed,
        uint256 interestRate,
        uint256 timestamp
    );
    event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest, uint256 timestamp);
    event LoanLiquidated(
        address indexed borrower,
        address indexed liquidator,
        uint256 collateral,
        uint256 debt,
        uint256 timestamp
    );
    event ComplianceTransfer(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    event KYCContractUpdated(address indexed oldContract, address indexed newContract);
    event AddressBlacklistedEvent(address indexed account, string reason);
    event AddressRemovedFromBlacklist(address indexed account, string reason);

    // -------------------------------------------------------------------------
    // Structs
    // -------------------------------------------------------------------------
    struct Loan {
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 interestRate; // basis points (e.g., 500 = 5%)
        uint256 startTime;
        bool active;
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    IHashKeyKYC public kycContract;
    IERC20 public immutable lendingToken;
    IERC20 public immutable collateralToken;

    uint256 public collateralRatio; // basis points (e.g., 15000 = 150%)
    uint256 public liquidationThreshold; // basis points (e.g., 12000 = 120%)
    uint256 public baseInterestRate; // basis points per year
    uint256 public transactionLimit;
    uint256 public dailyLimit;

    uint256 public totalDeposits;
    uint256 public totalBorrowed;

    mapping(address => uint256) public lenderBalances;
    mapping(address => Loan) public loans;
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) private _dailyTransferred;
    mapping(address => uint256) private _lastTransferDay;

    uint256 private _transferNonce;

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------
    modifier onlyVerifiedHuman() {
        (bool isValid,) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        _;
    }

    modifier onlyMinKycLevel(uint8 minLevel) {
        (bool isValid, uint8 level) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        if (level < minLevel) revert KYCInsufficientLevel(msg.sender, minLevel, level);
        _;
    }

    modifier notBlacklisted(address account) {
        if (isBlacklisted[account]) revert AddressBlacklisted(account);
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(
        address admin,
        address kycContract_,
        address lendingToken_,
        address collateralToken_,
        uint256 collateralRatio_,
        uint256 liquidationThreshold_,
        uint256 baseInterestRate_,
        uint256 transactionLimit_,
        uint256 dailyLimit_
    ) {
        if (admin == address(0)) revert ZeroAddress();
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        if (lendingToken_ == address(0)) revert ZeroAddress();
        if (collateralToken_ == address(0)) revert ZeroAddress();
        if (collateralRatio_ < 10000) revert InvalidCollateralRatio();
        if (liquidationThreshold_ >= collateralRatio_) revert InvalidCollateralRatio();
        if (baseInterestRate_ == 0) revert InvalidInterestRate();
        if (transactionLimit_ == 0) revert LimitTooLow();
        if (dailyLimit_ == 0) revert LimitTooLow();

        kycContract = IHashKeyKYC(kycContract_);
        lendingToken = IERC20(lendingToken_);
        collateralToken = IERC20(collateralToken_);
        collateralRatio = collateralRatio_;
        liquidationThreshold = liquidationThreshold_;
        baseInterestRate = baseInterestRate_;
        transactionLimit = transactionLimit_;
        dailyLimit = dailyLimit_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(LIQUIDATOR_ROLE, admin);
    }

    // -------------------------------------------------------------------------
    // Lender Functions
    // -------------------------------------------------------------------------
    function deposit(uint256 amount)
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        uint256 balanceBefore = lendingToken.balanceOf(address(this));
        lendingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = lendingToken.balanceOf(address(this)) - balanceBefore;

        lenderBalances[msg.sender] += received;
        totalDeposits += received;

        _emitComplianceEvent(msg.sender, address(this), received);
        emit Deposited(msg.sender, received, block.timestamp);
    }

    function withdraw(uint256 amount)
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        uint256 balance = lenderBalances[msg.sender];
        if (amount > balance) revert InsufficientBalance(amount, balance);

        _enforceDailyLimit(msg.sender, amount);

        uint256 available = lendingToken.balanceOf(address(this));
        if (amount > available) revert InsufficientBalance(amount, available);

        lenderBalances[msg.sender] = balance - amount;
        totalDeposits -= amount;

        _emitComplianceEvent(address(this), msg.sender, amount);
        emit Withdrawn(msg.sender, amount, block.timestamp);

        lendingToken.safeTransfer(msg.sender, amount);
    }

    // -------------------------------------------------------------------------
    // Borrower Functions
    // -------------------------------------------------------------------------
    function borrow(uint256 collateralAmount, uint256 borrowAmount)
        external
        onlyMinKycLevel(2) // Advanced KYC required for borrowing
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
    {
        if (collateralAmount == 0 || borrowAmount == 0) revert ZeroAmount();
        if (loans[msg.sender].active) revert LoanAlreadyExists(msg.sender);
        if (borrowAmount > transactionLimit) revert ExceedsTransactionLimit(borrowAmount, transactionLimit);

        // Check collateral ratio (simplified: assumes 1:1 price ratio)
        uint256 requiredCollateral = (borrowAmount * collateralRatio) / 10000;
        if (collateralAmount < requiredCollateral) {
            revert InsufficientCollateral(requiredCollateral, collateralAmount);
        }

        // Check available liquidity
        uint256 available = lendingToken.balanceOf(address(this));
        if (borrowAmount > available) revert InsufficientBalance(borrowAmount, available);

        // Transfer collateral in
        collateralToken.safeTransferFrom(msg.sender, address(this), collateralAmount);

        // Create loan
        loans[msg.sender] = Loan({
            collateralAmount: collateralAmount,
            borrowedAmount: borrowAmount,
            interestRate: baseInterestRate,
            startTime: block.timestamp,
            active: true
        });

        totalBorrowed += borrowAmount;

        emit LoanCreated(msg.sender, collateralAmount, borrowAmount, baseInterestRate, block.timestamp);
        _emitComplianceEvent(address(this), msg.sender, borrowAmount);

        // Transfer borrowed tokens to borrower
        lendingToken.safeTransfer(msg.sender, borrowAmount);
    }

    function repay()
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
    {
        Loan storage loan = loans[msg.sender];
        if (!loan.active) revert NoActiveLoan(msg.sender);

        uint256 interest = calculateInterest(msg.sender);
        uint256 totalRepayment = loan.borrowedAmount + interest;

        // Transfer repayment
        lendingToken.safeTransferFrom(msg.sender, address(this), totalRepayment);

        // Return collateral
        uint256 collateral = loan.collateralAmount;
        totalBorrowed -= loan.borrowedAmount;

        // Clear loan
        delete loans[msg.sender];

        emit LoanRepaid(msg.sender, totalRepayment - interest, interest, block.timestamp);
        _emitComplianceEvent(msg.sender, address(this), totalRepayment);

        collateralToken.safeTransfer(msg.sender, collateral);
    }

    // -------------------------------------------------------------------------
    // Liquidation
    // -------------------------------------------------------------------------
    function liquidate(address borrower)
        external
        onlyRole(LIQUIDATOR_ROLE)
        notBlacklisted(borrower)
        whenNotPaused
        nonReentrant
    {
        Loan storage loan = loans[borrower];
        if (!loan.active) revert NoActiveLoan(borrower);

        // Check if loan is undercollateralized (simplified)
        uint256 totalDebt = loan.borrowedAmount + calculateInterest(borrower);
        uint256 collateralValue = loan.collateralAmount; // Assumes 1:1, use oracle in production

        if ((collateralValue * 10000) / totalDebt >= liquidationThreshold) {
            revert LoanNotLiquidatable(borrower);
        }

        uint256 collateral = loan.collateralAmount;
        totalBorrowed -= loan.borrowedAmount;

        delete loans[borrower];

        emit LoanLiquidated(borrower, msg.sender, collateral, totalDebt, block.timestamp);

        // Transfer collateral to liquidator
        collateralToken.safeTransfer(msg.sender, collateral);
    }

    // -------------------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------------------
    function calculateInterest(address borrower) public view returns (uint256) {
        Loan storage loan = loans[borrower];
        if (!loan.active) return 0;

        uint256 timeElapsed = block.timestamp - loan.startTime;
        // Simple interest: principal * rate * time / (365 days * 10000 basis points)
        return (loan.borrowedAmount * loan.interestRate * timeElapsed) / (365 days * 10000);
    }

    function getAvailableLiquidity() external view returns (uint256) {
        return lendingToken.balanceOf(address(this));
    }

    function getLoan(address borrower) external view returns (Loan memory) {
        return loans[borrower];
    }

    // -------------------------------------------------------------------------
    // Admin Functions
    // -------------------------------------------------------------------------
    function setKycContract(address newKycContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newKycContract == address(0)) revert KYCContractZeroAddress();
        address old = address(kycContract);
        kycContract = IHashKeyKYC(newKycContract);
        emit KYCContractUpdated(old, newKycContract);
    }

    function addToBlacklist(address account, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        isBlacklisted[account] = true;
        emit AddressBlacklistedEvent(account, reason);
    }

    function removeFromBlacklist(address account, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        isBlacklisted[account] = false;
        emit AddressRemovedFromBlacklist(account, reason);
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    // -------------------------------------------------------------------------
    // Internal Functions
    // -------------------------------------------------------------------------
    function _enforceDailyLimit(address account, uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;
        if (_lastTransferDay[account] != today) {
            _lastTransferDay[account] = today;
            _dailyTransferred[account] = 0;
        }
        uint256 remaining = dailyLimit - _dailyTransferred[account];
        if (amount > remaining) revert ExceedsDailyLimit(amount, remaining);
        _dailyTransferred[account] += amount;
    }

    function _emitComplianceEvent(address from, address to, uint256 amount) internal {
        unchecked { _transferNonce++; }
        bytes32 transferId = keccak256(
            abi.encode(block.chainid, address(this), _transferNonce, block.timestamp)
        );
        emit ComplianceTransfer(transferId, from, to, amount, block.timestamp);
    }
}
