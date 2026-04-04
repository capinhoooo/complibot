// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CompliantDEX
 * @notice A regulation-compliant constant-product AMM (DEX) for HashKey Chain.
 *
 * Compliance features:
 * - KYC gate via HashKey KYC SBT (all traders and liquidity providers)
 * - AML blacklist screening
 * - Per-transaction and daily swap limits (FATF Travel Rule)
 * - Role-based access control
 * - Emergency pause
 * - Reentrancy protection
 * - Regulatory event emissions
 * - Slippage protection
 *
 * AMM model: Constant product (x * y = k)
 * Fee: 0.3% (30 basis points) per swap
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

contract CompliantDEX is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------
    error KYCNotVerified(address account);
    error KYCContractZeroAddress();
    error AddressBlacklisted(address account);
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientLiquidity();
    error InsufficientOutput(uint256 output, uint256 minOutput);
    error InsufficientLPBalance(uint256 requested, uint256 available);
    error ExceedsTransactionLimit(uint256 amount, uint256 limit);
    error ExceedsDailyLimit(uint256 amount, uint256 remaining);
    error LimitTooLow();
    error InvalidToken();
    error PoolNotInitialized();
    error PoolAlreadyInitialized();

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------
    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 lpTokens,
        uint256 timestamp
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 lpTokens,
        uint256 timestamp
    );
    event Swap(
        address indexed trader,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        uint256 timestamp
    );
    event ComplianceTransfer(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    event LargeSwapAlert(
        bytes32 indexed swapId,
        address indexed trader,
        uint256 amountIn,
        uint256 threshold
    );
    event KYCContractUpdated(address indexed oldContract, address indexed newContract);
    event AddressBlacklistedEvent(address indexed account, string reason);
    event AddressRemovedFromBlacklist(address indexed account, string reason);

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    IHashKeyKYC public kycContract;
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLPSupply;

    uint256 public constant FEE_NUMERATOR = 3; // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000;
    uint256 public constant TRAVEL_RULE_THRESHOLD = 8000e18;
    uint256 public constant MIN_LIQUIDITY = 1000;

    uint256 public transactionLimit;
    uint256 public dailyLimit;

    mapping(address => uint256) public lpBalances;
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) private _dailySwapped;
    mapping(address => uint256) private _lastSwapDay;

    uint256 private _swapNonce;
    bool public initialized;

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

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(
        address admin,
        address kycContract_,
        address tokenA_,
        address tokenB_,
        uint256 transactionLimit_,
        uint256 dailyLimit_
    ) {
        if (admin == address(0)) revert ZeroAddress();
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        if (tokenA_ == address(0) || tokenB_ == address(0)) revert ZeroAddress();
        if (transactionLimit_ == 0) revert LimitTooLow();
        if (dailyLimit_ == 0) revert LimitTooLow();

        kycContract = IHashKeyKYC(kycContract_);
        tokenA = IERC20(tokenA_);
        tokenB = IERC20(tokenB_);
        transactionLimit = transactionLimit_;
        dailyLimit = dailyLimit_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // -------------------------------------------------------------------------
    // Liquidity Functions
    // -------------------------------------------------------------------------
    function addLiquidity(uint256 amountA, uint256 amountB)
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
        returns (uint256 lpTokens)
    {
        if (amountA == 0 || amountB == 0) revert ZeroAmount();

        if (!initialized) {
            // First deposit: initialize the pool
            initialized = true;
            lpTokens = _sqrt(amountA * amountB);
            if (lpTokens < MIN_LIQUIDITY) revert InsufficientLiquidity();
        } else {
            // Subsequent deposits: proportional to existing reserves
            uint256 lpFromA = (amountA * totalLPSupply) / reserveA;
            uint256 lpFromB = (amountB * totalLPSupply) / reserveB;
            lpTokens = lpFromA < lpFromB ? lpFromA : lpFromB;
        }

        tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        tokenB.safeTransferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;
        totalLPSupply += lpTokens;
        lpBalances[msg.sender] += lpTokens;

        emit LiquidityAdded(msg.sender, amountA, amountB, lpTokens, block.timestamp);
    }

    function removeLiquidity(uint256 lpAmount)
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
        returns (uint256 amountA, uint256 amountB)
    {
        if (lpAmount == 0) revert ZeroAmount();
        if (lpAmount > lpBalances[msg.sender]) {
            revert InsufficientLPBalance(lpAmount, lpBalances[msg.sender]);
        }

        amountA = (lpAmount * reserveA) / totalLPSupply;
        amountB = (lpAmount * reserveB) / totalLPSupply;

        lpBalances[msg.sender] -= lpAmount;
        totalLPSupply -= lpAmount;
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB, lpAmount, block.timestamp);

        tokenA.safeTransfer(msg.sender, amountA);
        tokenB.safeTransfer(msg.sender, amountB);
    }

    // -------------------------------------------------------------------------
    // Swap Functions
    // -------------------------------------------------------------------------
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    )
        external
        onlyVerifiedHuman
        notBlacklisted(msg.sender)
        whenNotPaused
        nonReentrant
        returns (uint256 amountOut)
    {
        if (!initialized) revert PoolNotInitialized();
        if (amountIn == 0) revert ZeroAmount();
        if (amountIn > transactionLimit) revert ExceedsTransactionLimit(amountIn, transactionLimit);
        if (tokenIn != address(tokenA) && tokenIn != address(tokenB)) revert InvalidToken();

        _enforceDailyLimit(msg.sender, amountIn);

        bool isAtoB = tokenIn == address(tokenA);
        (uint256 reserveIn, uint256 reserveOut) = isAtoB
            ? (reserveA, reserveB)
            : (reserveB, reserveA);

        // Calculate output with 0.3% fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);

        if (amountOut < minAmountOut) revert InsufficientOutput(amountOut, minAmountOut);
        if (amountOut == 0) revert InsufficientLiquidity();

        // Transfer tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Update reserves
        if (isAtoB) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        uint256 fee = (amountIn * FEE_NUMERATOR) / FEE_DENOMINATOR;

        // Emit compliance events
        _emitSwapCompliance(msg.sender, amountIn);

        address tokenOut = isAtoB ? address(tokenB) : address(tokenA);
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, fee, block.timestamp);

        // Transfer output to trader
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
    }

    // -------------------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------------------
    function getAmountOut(address tokenIn, uint256 amountIn)
        external
        view
        returns (uint256 amountOut)
    {
        if (!initialized) return 0;

        bool isAtoB = tokenIn == address(tokenA);
        (uint256 reserveIn, uint256 reserveOut) = isAtoB
            ? (reserveA, reserveB)
            : (reserveB, reserveA);

        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
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
    // Internal Functions
    // -------------------------------------------------------------------------
    function _enforceDailyLimit(address account, uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;
        if (_lastSwapDay[account] != today) {
            _lastSwapDay[account] = today;
            _dailySwapped[account] = 0;
        }
        uint256 remaining = dailyLimit - _dailySwapped[account];
        if (amount > remaining) revert ExceedsDailyLimit(amount, remaining);
        _dailySwapped[account] += amount;
    }

    function _emitSwapCompliance(address trader, uint256 amount) internal {
        unchecked { _swapNonce++; }
        bytes32 swapId = keccak256(
            abi.encode(block.chainid, address(this), _swapNonce, block.timestamp)
        );

        emit ComplianceTransfer(swapId, trader, address(this), amount, block.timestamp);

        if (amount >= TRAVEL_RULE_THRESHOLD) {
            emit LargeSwapAlert(swapId, trader, amount, TRAVEL_RULE_THRESHOLD);
        }
    }

    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
