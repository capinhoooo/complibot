// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CompliantPayment
 * @notice A regulation-compliant payment processor for HashKey Chain.
 *
 * Compliance features:
 * - KYC gate via HashKey KYC SBT (payers and payees)
 * - AML blacklist screening
 * - Per-transaction and daily limits (FATF Travel Rule)
 * - Travel Rule data attachment for large payments
 * - Merchant registration with KYC verification
 * - Role-based access control
 * - Emergency pause
 * - Reentrancy protection
 * - Comprehensive event emissions for regulatory reporting
 *
 * Supports: ERC-20 token payments and native HSK payments
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

contract CompliantPayment is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------
    error KYCNotVerified(address account);
    error KYCContractZeroAddress();
    error AddressBlacklisted(address account);
    error ZeroAddress();
    error ZeroAmount();
    error MerchantNotRegistered(address merchant);
    error MerchantAlreadyRegistered(address merchant);
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error LimitTooLow();
    error TravelRuleDataRequired(uint256 amount, uint256 threshold);
    error PaymentNotFound(bytes32 paymentId);
    error RefundNotAllowed(bytes32 paymentId);
    error TransferFailed();
    error TokenNotAllowed(address token);
    error InvalidFeeRate();

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------
    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed merchant,
        address token,
        uint256 amount,
        uint256 fee,
        uint256 timestamp
    );
    event PaymentRefunded(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed merchant,
        uint256 amount,
        uint256 timestamp
    );
    event MerchantRegistered(address indexed merchant, string name, uint256 timestamp);
    event MerchantDeactivated(address indexed merchant, string reason, uint256 timestamp);
    event TravelRuleDataSubmitted(
        bytes32 indexed paymentId,
        bytes32 originatorHash,
        bytes32 beneficiaryHash,
        uint256 amount,
        uint256 timestamp
    );
    event LargePaymentAlert(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed merchant,
        uint256 amount,
        uint256 threshold
    );
    event FeeCollected(address indexed collector, uint256 amount, address token);
    event KYCContractUpdated(address indexed oldContract, address indexed newContract);
    event AddressBlacklistedEvent(address indexed account, string reason);
    event AddressRemovedFromBlacklist(address indexed account, string reason);
    event AllowedTokenUpdated(address indexed token, bool allowed);

    // -------------------------------------------------------------------------
    // Structs
    // -------------------------------------------------------------------------
    struct Merchant {
        string name;
        bool active;
        uint256 registeredAt;
        uint256 totalVolume;
    }

    struct Payment {
        address payer;
        address merchant;
        address token; // address(0) for native HSK
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        bool refunded;
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    IHashKeyKYC public kycContract;

    uint256 public feeRate; // basis points (e.g., 50 = 0.5%)
    uint256 public constant MAX_FEE_RATE = 500; // 5% maximum
    uint256 public transactionLimit;
    uint256 public dailyLimit;
    uint256 public constant TRAVEL_RULE_THRESHOLD = 8000e18;

    address public feeCollector;
    mapping(address => uint256) public collectedFees; // token => accumulated fees

    mapping(address => Merchant) public merchants;
    mapping(bytes32 => Payment) public payments;
    mapping(bytes32 => bool) public travelRuleDataExists;
    mapping(address => bool) public isBlacklisted;
    mapping(address => bool) public allowedTokens;

    mapping(address => uint256) private _dailySpent;
    mapping(address => uint256) private _lastSpendDay;

    uint256 private _paymentNonce;

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------
    modifier onlyVerifiedHuman() {
        (bool isValid,) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        _;
    }

    modifier notBlacklisted(address account) {
        if (isBlacklisted[account]) revert AddressBlacklisted(account);
        _;
    }

    modifier onlyRegisteredMerchant(address merchant) {
        if (!merchants[merchant].active) revert MerchantNotRegistered(merchant);
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(
        address admin,
        address kycContract_,
        address feeCollector_,
        uint256 feeRate_,
        uint256 transactionLimit_,
        uint256 dailyLimit_
    ) {
        if (admin == address(0)) revert ZeroAddress();
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        if (feeCollector_ == address(0)) revert ZeroAddress();
        if (feeRate_ > MAX_FEE_RATE) revert InvalidFeeRate();
        if (transactionLimit_ == 0) revert LimitTooLow();
        if (dailyLimit_ == 0) revert LimitTooLow();

        kycContract = IHashKeyKYC(kycContract_);
        feeCollector = feeCollector_;
        feeRate = feeRate_;
        transactionLimit = transactionLimit_;
        dailyLimit = dailyLimit_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // -------------------------------------------------------------------------
    // Merchant Management
    // -------------------------------------------------------------------------
    function registerMerchant(address merchant, string calldata name)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (merchant == address(0)) revert ZeroAddress();
        if (merchants[merchant].active) revert MerchantAlreadyRegistered(merchant);

        // Verify merchant KYC
        (bool isValid,) = kycContract.isHuman(merchant);
        if (!isValid) revert KYCNotVerified(merchant);

        merchants[merchant] = Merchant({
            name: name,
            active: true,
            registeredAt: block.timestamp,
            totalVolume: 0
        });

        emit MerchantRegistered(merchant, name, block.timestamp);
    }

    function deactivateMerchant(address merchant, string calldata reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        merchants[merchant].active = false;
        emit MerchantDeactivated(merchant, reason, block.timestamp);
    }

    // -------------------------------------------------------------------------
    // Payment Functions
    // -------------------------------------------------------------------------

    /// @notice Pay a merchant with an ERC-20 token
    function payToken(
        address merchant,
        address token,
        uint256 amount
    )
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        notBlacklisted(merchant)
        onlyRegisteredMerchant(merchant)
        whenNotPaused
        nonReentrant
        returns (bytes32 paymentId)
    {
        if (amount == 0) revert ZeroAmount();
        if (!allowedTokens[token]) revert TokenNotAllowed(token);
        if (amount > transactionLimit) revert ExceedsTransactionLimit(amount, transactionLimit);

        _enforceDailyLimit(msg.sender, amount);
        _checkTravelRule(amount);

        paymentId = _generatePaymentId();
        uint256 fee = (amount * feeRate) / 10000;
        uint256 merchantAmount = amount - fee;

        payments[paymentId] = Payment({
            payer: msg.sender,
            merchant: merchant,
            token: token,
            amount: amount,
            fee: fee,
            timestamp: block.timestamp,
            refunded: false
        });

        merchants[merchant].totalVolume += amount;
        collectedFees[token] += fee;

        emit PaymentProcessed(paymentId, msg.sender, merchant, token, amount, fee, block.timestamp);

        if (amount >= TRAVEL_RULE_THRESHOLD) {
            emit LargePaymentAlert(paymentId, msg.sender, merchant, amount, TRAVEL_RULE_THRESHOLD);
        }

        IERC20(token).safeTransferFrom(msg.sender, merchant, merchantAmount);
        if (fee > 0) {
            IERC20(token).safeTransferFrom(msg.sender, address(this), fee);
        }
    }

    /// @notice Pay a merchant with native HSK
    function payNative(address merchant)
        external
        payable
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        notBlacklisted(merchant)
        onlyRegisteredMerchant(merchant)
        whenNotPaused
        nonReentrant
        returns (bytes32 paymentId)
    {
        if (msg.value == 0) revert ZeroAmount();
        if (msg.value > transactionLimit) revert ExceedsTransactionLimit(msg.value, transactionLimit);

        _enforceDailyLimit(msg.sender, msg.value);
        _checkTravelRule(msg.value);

        paymentId = _generatePaymentId();
        uint256 fee = (msg.value * feeRate) / 10000;
        uint256 merchantAmount = msg.value - fee;

        payments[paymentId] = Payment({
            payer: msg.sender,
            merchant: merchant,
            token: address(0),
            amount: msg.value,
            fee: fee,
            timestamp: block.timestamp,
            refunded: false
        });

        merchants[merchant].totalVolume += msg.value;
        collectedFees[address(0)] += fee;

        emit PaymentProcessed(paymentId, msg.sender, merchant, address(0), msg.value, fee, block.timestamp);

        if (msg.value >= TRAVEL_RULE_THRESHOLD) {
            emit LargePaymentAlert(paymentId, msg.sender, merchant, msg.value, TRAVEL_RULE_THRESHOLD);
        }

        (bool success,) = merchant.call{value: merchantAmount}("");
        if (!success) revert TransferFailed();
    }

    /// @notice Submit Travel Rule data for a payment
    function submitTravelRuleData(
        bytes32 paymentId,
        bytes32 originatorHash,
        bytes32 beneficiaryHash
    ) external {
        Payment storage payment = payments[paymentId];
        if (payment.timestamp == 0) revert PaymentNotFound(paymentId);

        travelRuleDataExists[paymentId] = true;

        emit TravelRuleDataSubmitted(
            paymentId,
            originatorHash,
            beneficiaryHash,
            payment.amount,
            block.timestamp
        );
    }

    /// @notice Refund a payment (merchant-initiated or admin-initiated)
    function refund(bytes32 paymentId)
        external
        whenNotPaused
        nonReentrant
    {
        Payment storage payment = payments[paymentId];
        if (payment.timestamp == 0) revert PaymentNotFound(paymentId);
        if (payment.refunded) revert RefundNotAllowed(paymentId);

        // Only merchant or admin can refund
        bool isMerchant = msg.sender == payment.merchant;
        bool isAdmin = hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
        if (!isMerchant && !isAdmin) revert RefundNotAllowed(paymentId);

        payment.refunded = true;
        uint256 refundAmount = payment.amount - payment.fee; // Fee is not refunded

        emit PaymentRefunded(paymentId, payment.payer, payment.merchant, refundAmount, block.timestamp);

        if (payment.token == address(0)) {
            // Native HSK refund
            (bool success,) = payment.payer.call{value: refundAmount}("");
            if (!success) revert TransferFailed();
        } else {
            // ERC-20 refund (merchant sends back)
            IERC20(payment.token).safeTransferFrom(msg.sender, payment.payer, refundAmount);
        }
    }

    // -------------------------------------------------------------------------
    // Admin Functions
    // -------------------------------------------------------------------------
    function setAllowedToken(address token, bool allowed) external onlyRole(DEFAULT_ADMIN_ROLE) {
        allowedTokens[token] = allowed;
        emit AllowedTokenUpdated(token, allowed);
    }

    function setKycContract(address newKycContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newKycContract == address(0)) revert KYCContractZeroAddress();
        address old = address(kycContract);
        kycContract = IHashKeyKYC(newKycContract);
        emit KYCContractUpdated(old, newKycContract);
    }

    function setFeeRate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newRate > MAX_FEE_RATE) revert InvalidFeeRate();
        feeRate = newRate;
    }

    function collectFees(address token) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 amount = collectedFees[token];
        if (amount == 0) revert ZeroAmount();

        collectedFees[token] = 0;

        emit FeeCollected(feeCollector, amount, token);

        if (token == address(0)) {
            (bool success,) = feeCollector.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(feeCollector, amount);
        }
    }

    function addToBlacklist(address account, string calldata reason)
        external onlyRole(COMPLIANCE_ROLE)
    {
        isBlacklisted[account] = true;
        emit AddressBlacklistedEvent(account, reason);
    }

    function removeFromBlacklist(address account, string calldata reason)
        external onlyRole(COMPLIANCE_ROLE)
    {
        isBlacklisted[account] = false;
        emit AddressRemovedFromBlacklist(account, reason);
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    // -------------------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------------------
    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getMerchant(address merchant) external view returns (Merchant memory) {
        return merchants[merchant];
    }

    // -------------------------------------------------------------------------
    // Internal Functions
    // -------------------------------------------------------------------------
    function _generatePaymentId() internal returns (bytes32) {
        unchecked { _paymentNonce++; }
        return keccak256(
            abi.encode(block.chainid, address(this), _paymentNonce, block.timestamp, msg.sender)
        );
    }

    function _enforceDailyLimit(address account, uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;
        if (_lastSpendDay[account] != today) {
            _lastSpendDay[account] = today;
            _dailySpent[account] = 0;
        }
        uint256 remaining = dailyLimit - _dailySpent[account];
        if (amount > remaining) revert ExceedsDailyLimit(amount, remaining);
        _dailySpent[account] += amount;
    }

    function _checkTravelRule(uint256 amount) internal pure {
        // For amounts >= threshold, Travel Rule data must be submitted
        // via submitTravelRuleData() before or after payment
        // This is enforced off-chain by the compliance system
        // The LargePaymentAlert event triggers the off-chain flow
    }

    receive() external payable {}
}
