// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CompliantVault} from "../src/examples/CompliantVault.sol";
import {MockKYCSBT} from "../src/mocks/MockKYCSBT.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

/// @dev Simple ERC20 for testing
contract MockToken is ERC20 {
    constructor() ERC20("Mock", "MCK") {
        _mint(msg.sender, 1_000_000e18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CompliantVaultTest is Test {
    CompliantVault public vault;
    MockKYCSBT public kyc;
    MockToken public token;

    address public admin = makeAddr("admin");
    address public user = makeAddr("user");
    address public nobody = makeAddr("nobody");

    uint256 public constant TX_LIMIT = 100 ether;
    uint256 public constant DAILY_LIMIT = 500 ether;

    function setUp() public {
        kyc = new MockKYCSBT(admin);
        vault = new CompliantVault(admin, address(kyc), TX_LIMIT, DAILY_LIMIT);

        token = new MockToken();

        // KYC verify the user
        vm.prank(admin);
        kyc.setKycStatus(user, 1, 1, "user.hsk");

        // Fund user with tokens and native
        token.mint(user, 1000e18);
        vm.deal(user, 100 ether);
    }

    // --- Native Deposit ---

    function test_depositNative_success() public {
        vm.prank(user);
        vault.depositNative{value: 1 ether}();
        assertEq(vault.nativeBalances(user), 1 ether);
    }

    function test_depositNative_revertsOnZero() public {
        vm.prank(user);
        vm.expectRevert(CompliantVault.ZeroAmount.selector);
        vault.depositNative{value: 0}();
    }

    function test_depositNative_revertsOverTxLimit() public {
        vm.deal(user, 200 ether);
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                CompliantVault.ExceedsTransactionLimit.selector, 101 ether, TX_LIMIT
            )
        );
        vault.depositNative{value: 101 ether}();
    }

    function test_depositNative_revertsWithoutKyc() public {
        vm.deal(nobody, 10 ether);
        vm.prank(nobody);
        vm.expectRevert();
        vault.depositNative{value: 1 ether}();
    }

    // --- Native Withdraw ---

    function test_withdrawNative_success() public {
        vm.prank(user);
        vault.depositNative{value: 10 ether}();

        uint256 balBefore = user.balance;
        vm.prank(user);
        vault.withdrawNative(5 ether);

        assertEq(vault.nativeBalances(user), 5 ether);
        assertEq(user.balance, balBefore + 5 ether);
    }

    function test_withdrawNative_revertsOnInsufficientBalance() public {
        vm.prank(user);
        vault.depositNative{value: 1 ether}();

        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(CompliantVault.InsufficientBalance.selector, 2 ether, 1 ether)
        );
        vault.withdrawNative(2 ether);
    }

    function test_withdrawNative_revertsOnDailyLimit() public {
        // Deposit a lot
        vm.deal(user, 1000 ether);

        // Deposit in multiple transactions under the tx limit
        for (uint256 i; i < 6; i++) {
            vm.prank(user);
            vault.depositNative{value: 100 ether}();
        }

        // Withdraw up to daily limit
        for (uint256 i; i < 5; i++) {
            vm.prank(user);
            vault.withdrawNative(100 ether);
        }

        // Next withdrawal should hit daily limit
        vm.prank(user);
        vm.expectRevert();
        vault.withdrawNative(1 ether);
    }

    // --- Token Deposit ---

    function test_depositToken_success() public {
        vm.startPrank(user);
        token.approve(address(vault), 100e18);
        vault.deposit(address(token), 100e18);
        vm.stopPrank();

        assertEq(vault.tokenBalances(user, address(token)), 100e18);
        assertEq(token.balanceOf(address(vault)), 100e18);
    }

    function test_depositToken_revertsOnZeroAddress() public {
        vm.prank(user);
        vm.expectRevert(CompliantVault.ZeroAddress.selector);
        vault.deposit(address(0), 100e18);
    }

    // --- Token Withdraw ---

    function test_withdrawToken_success() public {
        vm.startPrank(user);
        token.approve(address(vault), 100e18);
        vault.deposit(address(token), 100e18);
        vault.withdraw(address(token), 50e18);
        vm.stopPrank();

        assertEq(vault.tokenBalances(user, address(token)), 50e18);
    }

    // --- Pause ---

    function test_pause_blocksDeposits() public {
        vm.prank(admin);
        vault.pause();

        vm.prank(user);
        vm.expectRevert();
        vault.depositNative{value: 1 ether}();
    }

    function test_pause_blocksWithdrawals() public {
        vm.prank(user);
        vault.depositNative{value: 1 ether}();

        vm.prank(admin);
        vault.pause();

        vm.prank(user);
        vm.expectRevert();
        vault.withdrawNative(0.5 ether);
    }

    function test_pause_onlyAdmin() public {
        vm.prank(nobody);
        vm.expectRevert();
        vault.pause();
    }

    // --- Admin Functions ---

    function test_setTransactionLimit_success() public {
        vm.prank(admin);
        vault.setTransactionLimit(200 ether);
        assertEq(vault.transactionLimit(), 200 ether);
    }

    function test_setDailyLimit_success() public {
        vm.prank(admin);
        vault.setDailyLimit(1000 ether);
        assertEq(vault.dailyLimit(), 1000 ether);
    }

    function test_withdrawNative_dailyLimitResetsNextDay() public {
        // Deposit plenty of native tokens
        vm.deal(user, 2000 ether);
        for (uint256 i; i < 10; i++) {
            vm.prank(user);
            vault.depositNative{value: 100 ether}();
        }

        // Withdraw up to the daily limit (500 ether in 5 x 100 ether txs)
        for (uint256 i; i < 5; i++) {
            vm.prank(user);
            vault.withdrawNative(100 ether);
        }

        // Should be at the daily limit now
        vm.prank(user);
        vm.expectRevert();
        vault.withdrawNative(1 ether);

        // Warp forward by 1 day
        vm.warp(block.timestamp + 1 days);

        // Should be able to withdraw again after the day resets
        vm.prank(user);
        vault.withdrawNative(100 ether);
        assertEq(vault.nativeBalances(user), 400 ether);
    }

    // --- Constructor limit validation tests (INFO-01) ---

    function test_constructor_revertsOnZeroTransactionLimit() public {
        vm.expectRevert(CompliantVault.LimitTooLow.selector);
        new CompliantVault(admin, address(kyc), 0, DAILY_LIMIT);
    }

    function test_constructor_revertsOnZeroDailyLimit() public {
        vm.expectRevert(CompliantVault.LimitTooLow.selector);
        new CompliantVault(admin, address(kyc), TX_LIMIT, 0);
    }

    function test_setTransactionLimit_revertsOnZero() public {
        vm.prank(admin);
        vm.expectRevert(CompliantVault.LimitTooLow.selector);
        vault.setTransactionLimit(0);
    }

    function test_setDailyLimit_revertsOnZero() public {
        vm.prank(admin);
        vm.expectRevert(CompliantVault.LimitTooLow.selector);
        vault.setDailyLimit(0);
    }

    function test_adminFunctions_revertForNonAdmin() public {
        vm.prank(nobody);
        vm.expectRevert();
        vault.setTransactionLimit(200 ether);

        vm.prank(nobody);
        vm.expectRevert();
        vault.setDailyLimit(1000 ether);
    }
}
