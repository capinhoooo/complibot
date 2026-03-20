// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockKYCSBT} from "../src/mocks/MockKYCSBT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockKYCSBTTest is Test {
    MockKYCSBT public kyc;
    address public owner = makeAddr("owner");
    address public user = makeAddr("user");
    address public nobody = makeAddr("nobody");

    function setUp() public {
        kyc = new MockKYCSBT(owner);
    }

    // --- setKycStatus ---

    function test_setKycStatus_success() public {
        vm.prank(owner);
        kyc.setKycStatus(user, 1, 1, "user.hsk");

        (bool isValid, uint8 level) = kyc.isHuman(user);
        assertTrue(isValid);
        assertEq(level, 1);
    }

    function test_setKycStatus_fullInfo() public {
        vm.prank(owner);
        kyc.setKycStatus(user, 2, 1, "user.hsk");

        (string memory ensName, uint8 level, uint8 status, uint256 createTime) =
            kyc.getKycInfo(user);
        assertEq(ensName, "user.hsk");
        assertEq(level, 2);
        assertEq(status, 1);
        assertEq(createTime, block.timestamp);
    }

    function test_setKycStatus_revertsOnZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert(MockKYCSBT.ZeroAddress.selector);
        kyc.setKycStatus(address(0), 1, 1, "zero.hsk");
    }

    function test_setKycStatus_revertsForNonOwner() public {
        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nobody)
        );
        kyc.setKycStatus(user, 1, 1, "user.hsk");
    }

    function test_setKycStatus_approvesEnsName() public {
        vm.prank(owner);
        kyc.setKycStatus(user, 1, 1, "user.hsk");

        assertTrue(kyc.isEnsNameApproved(user, "user.hsk"));
        assertFalse(kyc.isEnsNameApproved(user, "other.hsk"));
    }

    // --- isHuman ---

    function test_isHuman_falseByDefault() public view {
        (bool isValid, uint8 level) = kyc.isHuman(user);
        assertFalse(isValid);
        assertEq(level, 0);
    }

    function test_isHuman_falseForLevelZero() public {
        vm.prank(owner);
        kyc.setKycStatus(user, 0, 0, "");
        (bool isValid,) = kyc.isHuman(user);
        assertFalse(isValid);
    }

    // --- requestKyc ---

    function test_requestKyc_success() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        kyc.requestKyc{value: 0}("user.hsk");

        (bool isValid, uint8 level) = kyc.isHuman(user);
        assertTrue(isValid);
        assertEq(level, 1);
    }

    function test_requestKyc_revertsOnInsufficientFee() public {
        vm.prank(owner);
        kyc.setFee(0.1 ether);

        vm.deal(user, 1 ether);
        vm.prank(user);
        vm.expectRevert(MockKYCSBT.InsufficientFee.selector);
        kyc.requestKyc{value: 0.05 ether}("user.hsk");
    }

    // --- setFee ---

    function test_setFee_success() public {
        vm.prank(owner);
        kyc.setFee(0.1 ether);
        assertEq(kyc.getTotalFee(), 0.1 ether);
    }

    function test_setFee_revertsForNonOwner() public {
        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nobody)
        );
        kyc.setFee(0.1 ether);
    }
}
