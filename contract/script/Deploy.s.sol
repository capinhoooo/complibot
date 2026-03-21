// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

import {MockKYCSBT} from "../src/mocks/MockKYCSBT.sol";
import {ComplianceCertificateRegistry} from "../src/ComplianceCertificateRegistry.sol";
import {CompliBotEAS} from "../src/CompliBotEAS.sol";

/// @title Deploy
/// @notice Foundry deployment script for CompliBot contracts on HashKey Chain Testnet
/// @dev Usage:
///      forge script script/Deploy.s.sol:Deploy \
///        --rpc-url hashkeyTestnet \
///        --broadcast \
///        --verify \
///        -vvvv
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Check for existing KYC contract or deploy mock
        address kycAddress = vm.envOr("KYC_CONTRACT_ADDRESS", address(0));

        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MockKYCSBT if no KYC contract address is provided
        if (kycAddress == address(0)) {
            MockKYCSBT mockKyc = new MockKYCSBT(deployer);
            kycAddress = address(mockKyc);
            console.log("MockKYCSBT deployed at:", kycAddress);

            // Set deployer as KYC verified for testing
            mockKyc.setKycStatus(deployer, 1, 1, "deployer.hsk");
            console.log("Deployer KYC status set");
        } else {
            console.log("Using existing KYC contract at:", kycAddress);
        }

        // 2. Deploy ComplianceCertificateRegistry
        ComplianceCertificateRegistry registry =
            new ComplianceCertificateRegistry(deployer, kycAddress);
        console.log("ComplianceCertificateRegistry deployed at:", address(registry));

        // 3. Deploy CompliBotEAS
        CompliBotEAS easAdapter = new CompliBotEAS(deployer);
        console.log("CompliBotEAS deployed at:", address(easAdapter));

        // 4. Grant ATTESTER_ROLE to deployer
        bytes32 attesterRole = registry.ATTESTER_ROLE();
        registry.grantRole(attesterRole, deployer);
        console.log("ATTESTER_ROLE granted to deployer on Registry");

        bytes32 easAttesterRole = easAdapter.ATTESTER_ROLE();
        easAdapter.grantRole(easAttesterRole, deployer);
        console.log("ATTESTER_ROLE granted to deployer on EAS Adapter");

        vm.stopBroadcast();

        // Log summary
        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("KYC Contract:      ", kycAddress);
        console.log("Registry:          ", address(registry));
        console.log("EAS Adapter:       ", address(easAdapter));
        console.log("Deployer/Admin:    ", deployer);
        console.log("==========================");
    }
}
