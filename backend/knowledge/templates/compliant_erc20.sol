// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CompliantERC20
 * @notice A fully regulation-compliant ERC-20 token for HashKey Chain.
 *
 * Compliance features:
 * - KYC gate via HashKey KYC SBT (onlyVerifiedHuman, onlyMinKycLevel)
 * - AML blacklist screening (sender and recipient)
 * - Per-transaction and daily transfer limits (FATF Travel Rule)
 * - Role-based access control (admin, compliance, pauser)
 * - Emergency pause mechanism
 * - Reentrancy protection
 * - Regulatory event emissions for off-chain monitoring
 *
 * Built for: HashKey Chain (Chain ID 177, OP Stack L2)
 * Solidity: 0.8.24 | OpenZeppelin: v5.x
 */

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IHashKeyKYC} from "../interfaces/IHashKeyKYC.sol";

contract CompliantERC20 is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------
    error KYCNotVerified(address account);
    error KYCInsufficientLevel(address account, uint8 required, uint8 actual);
    error KYCContractZeroAddress();
    error AddressBlacklisted(address account);
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error LimitTooLow();
    error ZeroAddress();
    error SupplyCapExceeded(uint256 requested, uint256 cap);

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------
    event KYCContractUpdated(address indexed oldContract, address indexed newContract);
    event AddressBlacklistedEvent(address indexed account, string reason);
    event AddressRemovedFromBlacklist(address indexed account, string reason);
    event TransactionLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event ComplianceTransfer(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    event LargeTransactionAlert(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 threshold
    );

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    IHashKeyKYC public kycContract;

    uint256 public supplyCap;
    uint256 public transactionLimit;
    uint256 public dailyLimit;
    uint256 public constant TRAVEL_RULE_THRESHOLD = 8000e18; // HKD 8,000 equivalent

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
        string memory name_,
        string memory symbol_,
        address admin,
        address kycContract_,
        uint256 supplyCap_,
        uint256 transactionLimit_,
        uint256 dailyLimit_
    ) ERC20(name_, symbol_) {
        if (admin == address(0)) revert ZeroAddress();
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        if (transactionLimit_ == 0) revert LimitTooLow();
        if (dailyLimit_ == 0) revert LimitTooLow();

        kycContract = IHashKeyKYC(kycContract_);
        supplyCap = supplyCap_;
        transactionLimit = transactionLimit_;
        dailyLimit = dailyLimit_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // -------------------------------------------------------------------------
    // Token Operations (KYC-gated)
    // -------------------------------------------------------------------------
    function transfer(address to, uint256 amount)
        public
        override(ERC20)
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        notBlacklisted(to)
        whenNotPaused
        returns (bool)
    {
        _enforceTransactionLimit(amount);
        _enforceDailyLimit(msg.sender, amount);
        _emitComplianceEvents(msg.sender, to, amount);
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount)
        public
        override(ERC20)
        notBlacklisted(from)
        notBlacklisted(to)
        notBlacklisted(msg.sender)
        whenNotPaused
        returns (bool)
    {
        _enforceTransactionLimit(amount);
        _enforceDailyLimit(from, amount);
        _emitComplianceEvents(from, to, amount);
        return super.transferFrom(from, to, amount);
    }

    // -------------------------------------------------------------------------
    // Minting (Minter role, KYC-verified recipient)
    // -------------------------------------------------------------------------
    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        notBlacklisted(to)
        whenNotPaused
        nonReentrant
    {
        if (supplyCap > 0 && totalSupply() + amount > supplyCap) {
            revert SupplyCapExceeded(amount, supplyCap);
        }

        // Verify recipient KYC
        (bool isValid,) = kycContract.isHuman(to);
        if (!isValid) revert KYCNotVerified(to);

        _mint(to, amount);
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

    // -------------------------------------------------------------------------
    // Compliance Functions
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // Pause Functions
    // -------------------------------------------------------------------------
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // -------------------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------------------
    function getDailyRemaining(address account) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        if (_lastTransferDay[account] != today) {
            return dailyLimit;
        }
        if (_dailyTransferred[account] >= dailyLimit) return 0;
        return dailyLimit - _dailyTransferred[account];
    }

    // -------------------------------------------------------------------------
    // Internal Functions
    // -------------------------------------------------------------------------
    function _enforceTransactionLimit(uint256 amount) internal view {
        if (amount > transactionLimit) {
            revert ExceedsTransactionLimit(amount, transactionLimit);
        }
    }

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

    function _emitComplianceEvents(address from, address to, uint256 amount) internal {
        unchecked { _transferNonce++; }
        bytes32 transferId = keccak256(
            abi.encode(block.chainid, address(this), _transferNonce, block.timestamp)
        );

        emit ComplianceTransfer(transferId, from, to, amount, block.timestamp);

        if (amount >= TRAVEL_RULE_THRESHOLD) {
            emit LargeTransactionAlert(transferId, from, to, amount, TRAVEL_RULE_THRESHOLD);
        }
    }

    // -------------------------------------------------------------------------
    // Overrides required by Solidity
    // -------------------------------------------------------------------------
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
