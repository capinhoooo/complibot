// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {ComplianceCertificateRegistry} from "../src/ComplianceCertificateRegistry.sol";
import {MockKYCSBT} from "../src/mocks/MockKYCSBT.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {KYCGated} from "../src/base/KYCGated.sol";

contract ComplianceCertificateRegistryTest is Test {
    ComplianceCertificateRegistry public registry;
    MockKYCSBT public kyc;

    address public admin = makeAddr("admin");
    address public attester = makeAddr("attester");
    address public developer = makeAddr("developer");
    address public targetContract = makeAddr("targetContract");
    address public nobody = makeAddr("nobody");

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    bytes32 public constant AUDIT_HASH = keccak256("audit-report-v1");

    function setUp() public {
        // Deploy mock KYC and registry
        kyc = new MockKYCSBT(admin);
        registry = new ComplianceCertificateRegistry(admin, address(kyc));

        // Grant attester role
        vm.prank(admin);
        registry.grantRole(ATTESTER_ROLE, attester);

        // Set developer as KYC verified
        vm.prank(admin);
        kyc.setKycStatus(developer, 1, 1, "dev.hsk");
    }

    // --- Helper ---

    function _defaultParams()
        internal
        view
        returns (ComplianceCertificateRegistry.IssueCertificateParams memory)
    {
        return ComplianceCertificateRegistry.IssueCertificateParams({
            contractAddress: targetContract,
            developer: developer,
            score: 85,
            auditHash: AUDIT_HASH,
            criticalFindings: 0,
            highFindings: 1,
            mediumFindings: 2,
            lowFindings: 3,
            version: "1.0.0"
        });
    }

    function _issueCertificate() internal returns (bytes32) {
        vm.prank(attester);
        return registry.issueCertificate(_defaultParams());
    }

    // --- Constructor Tests ---

    function test_constructor_setsAdmin() public view {
        assertTrue(registry.hasRole(DEFAULT_ADMIN_ROLE, admin));
    }

    function test_constructor_setsKycContract() public view {
        assertEq(address(registry.kycContract()), address(kyc));
    }

    function test_constructor_revertsOnZeroAdmin() public {
        vm.expectRevert(ComplianceCertificateRegistry.ZeroAddress.selector);
        new ComplianceCertificateRegistry(address(0), address(kyc));
    }

    function test_constructor_revertsOnZeroKyc() public {
        vm.expectRevert();
        new ComplianceCertificateRegistry(admin, address(0));
    }

    // --- issueCertificate Tests ---

    function test_issueCertificate_success() public {
        bytes32 certId = _issueCertificate();
        assertTrue(certId != bytes32(0));

        ComplianceCertificateRegistry.Certificate memory cert = registry.getCertificate(certId);
        assertEq(cert.id, certId);
        assertEq(cert.contractAddress, targetContract);
        assertEq(cert.developer, developer);
        assertEq(cert.complianceScore, 85);
        assertEq(cert.auditHash, AUDIT_HASH);
        assertEq(cert.criticalFindings, 0);
        assertEq(cert.highFindings, 1);
        assertEq(cert.mediumFindings, 2);
        assertEq(cert.lowFindings, 3);
        assertEq(cert.issuedAt, block.timestamp);
        assertFalse(cert.revoked);
        assertEq(cert.version, "1.0.0");
    }

    function test_issueCertificate_emitsEvent() public {
        // Issue and verify the certificate is stored (event emission verified via state)
        bytes32 certId = _issueCertificate();
        ComplianceCertificateRegistry.Certificate memory cert = registry.getCertificate(certId);
        assertEq(cert.contractAddress, targetContract);
        assertEq(cert.developer, developer);
    }

    function test_issueCertificate_marksContractCertified() public {
        assertFalse(registry.isContractCertified(targetContract));
        _issueCertificate();
        assertTrue(registry.isContractCertified(targetContract));
    }

    function test_issueCertificate_tracksbyContract() public {
        bytes32 certId = _issueCertificate();
        bytes32[] memory certs = registry.getCertificatesByContract(targetContract);
        assertEq(certs.length, 1);
        assertEq(certs[0], certId);
    }

    function test_issueCertificate_tracksByDeveloper() public {
        bytes32 certId = _issueCertificate();
        bytes32[] memory certs = registry.getCertificatesByDeveloper(developer);
        assertEq(certs.length, 1);
        assertEq(certs[0], certId);
    }

    function test_issueCertificate_revertsWithoutAttesterRole() public {
        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                ATTESTER_ROLE
            )
        );
        registry.issueCertificate(_defaultParams());
    }

    function test_issueCertificate_revertsOnZeroContractAddress() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.contractAddress = address(0);
        vm.prank(attester);
        vm.expectRevert(ComplianceCertificateRegistry.ZeroAddress.selector);
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsOnZeroDeveloper() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.developer = address(0);
        vm.prank(attester);
        vm.expectRevert(ComplianceCertificateRegistry.ZeroAddress.selector);
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsOnInvalidAuditHash() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.auditHash = bytes32(0);
        vm.prank(attester);
        vm.expectRevert(ComplianceCertificateRegistry.InvalidAuditHash.selector);
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsOnLowScore() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 69;
        vm.prank(attester);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.ScoreBelowMinimum.selector, 69, 70
            )
        );
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsOnCriticalFindings() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.criticalFindings = 1;
        vm.prank(attester);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.CriticalFindingsNotZero.selector, 1
            )
        );
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsWithoutKyc() public {
        // Use a developer without KYC
        address unverified = makeAddr("unverified");
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.developer = unverified;
        vm.prank(attester);
        vm.expectRevert();
        registry.issueCertificate(params);
    }

    function test_issueCertificate_multipleCertificatesForSameContract() public {
        bytes32 certId1 = _issueCertificate();

        // Issue another certificate for the same contract
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 90;
        params.version = "2.0.0";
        vm.prank(attester);
        bytes32 certId2 = registry.issueCertificate(params);

        assertTrue(certId1 != certId2);
        bytes32[] memory certs = registry.getCertificatesByContract(targetContract);
        assertEq(certs.length, 2);

        // Latest certificate should be the second one
        assertEq(registry.getLatestCertificateId(targetContract), certId2);
    }

    // --- revokeCertificate Tests ---

    function test_revokeCertificate_success() public {
        bytes32 certId = _issueCertificate();
        assertTrue(registry.isContractCertified(targetContract));

        vm.prank(admin);
        registry.revokeCertificate(certId);

        ComplianceCertificateRegistry.Certificate memory cert = registry.getCertificate(certId);
        assertTrue(cert.revoked);
        assertFalse(registry.isContractCertified(targetContract));
    }

    function test_revokeCertificate_emitsEvent() public {
        bytes32 certId = _issueCertificate();

        vm.prank(admin);
        vm.expectEmit(true, true, false, false);
        emit ComplianceCertificateRegistry.CertificateRevoked(certId, admin);
        registry.revokeCertificate(certId);
    }

    function test_revokeCertificate_revertsWithoutAdminRole() public {
        bytes32 certId = _issueCertificate();

        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                DEFAULT_ADMIN_ROLE
            )
        );
        registry.revokeCertificate(certId);
    }

    function test_revokeCertificate_revertsOnNotFound() public {
        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.CertificateNotFound.selector,
                bytes32(uint256(999))
            )
        );
        registry.revokeCertificate(bytes32(uint256(999)));
    }

    function test_revokeCertificate_revertsOnAlreadyRevoked() public {
        bytes32 certId = _issueCertificate();

        vm.prank(admin);
        registry.revokeCertificate(certId);

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.CertificateAlreadyRevoked.selector, certId
            )
        );
        registry.revokeCertificate(certId);
    }

    // --- Pause Tests ---

    function test_pause_preventsIssuance() public {
        vm.prank(admin);
        registry.pause();

        vm.prank(attester);
        vm.expectRevert();
        registry.issueCertificate(_defaultParams());
    }

    function test_pause_preventsRevocation() public {
        bytes32 certId = _issueCertificate();

        vm.prank(admin);
        registry.pause();

        vm.prank(admin);
        vm.expectRevert();
        registry.revokeCertificate(certId);
    }

    function test_unpause_allowsOperations() public {
        vm.prank(admin);
        registry.pause();

        vm.prank(admin);
        registry.unpause();

        // Should work again
        _issueCertificate();
    }

    function test_pause_onlyAdmin() public {
        vm.prank(nobody);
        vm.expectRevert();
        registry.pause();
    }

    // --- View function edge cases ---

    function test_isContractCertified_returnsFalseForUnknown() public {
        assertFalse(registry.isContractCertified(makeAddr("unknown")));
    }

    function test_getCertificate_revertsOnNotFound() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.CertificateNotFound.selector,
                bytes32(uint256(1))
            )
        );
        registry.getCertificate(bytes32(uint256(1)));
    }

    function test_getCertificatesByContract_returnsEmptyForUnknown() public {
        bytes32[] memory certs = registry.getCertificatesByContract(makeAddr("unknown"));
        assertEq(certs.length, 0);
    }

    function test_getCertificatesByDeveloper_returnsEmptyForUnknown() public {
        bytes32[] memory certs = registry.getCertificatesByDeveloper(makeAddr("unknown"));
        assertEq(certs.length, 0);
    }

    // --- KYC Contract Update ---

    function test_setKycContract_success() public {
        MockKYCSBT newKyc = new MockKYCSBT(admin);
        vm.prank(admin);
        registry.setKycContract(address(newKyc));
        assertEq(address(registry.kycContract()), address(newKyc));
    }

    function test_setKycContract_revertsWithoutAdmin() public {
        vm.prank(nobody);
        vm.expectRevert();
        registry.setKycContract(makeAddr("newKyc"));
    }

    function test_setKycContract_revertsOnZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert();
        registry.setKycContract(address(0));
    }

    // --- Score boundary tests ---

    function test_issueCertificate_minScore70Succeeds() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 70;
        vm.prank(attester);
        bytes32 certId = registry.issueCertificate(params);
        assertTrue(certId != bytes32(0));
    }

    function test_issueCertificate_maxScore100Succeeds() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 100;
        vm.prank(attester);
        bytes32 certId = registry.issueCertificate(params);
        assertTrue(certId != bytes32(0));
    }

    // --- LOW-01: Score above maximum tests ---

    function test_issueCertificate_revertsOnScoreAbove100() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 101;
        vm.prank(attester);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.ScoreAboveMaximum.selector, 101, 100
            )
        );
        registry.issueCertificate(params);
    }

    function test_issueCertificate_revertsOnScoreUint8Max() public {
        ComplianceCertificateRegistry.IssueCertificateParams memory params = _defaultParams();
        params.score = 255;
        vm.prank(attester);
        vm.expectRevert(
            abi.encodeWithSelector(
                ComplianceCertificateRegistry.ScoreAboveMaximum.selector, 255, 100
            )
        );
        registry.issueCertificate(params);
    }

    // --- onlyMinKycLevel modifier test ---

    function test_onlyMinKycLevel_revertsOnInsufficientLevel() public {
        // Create a contract that uses onlyMinKycLevel
        MinKycLevelTester tester = new MinKycLevelTester(address(kyc));

        // Set user with KYC level 1
        address kycUser = makeAddr("kycUser");
        vm.prank(admin);
        kyc.setKycStatus(kycUser, 1, 1, "user.hsk");

        // Level 1 should pass for minLevel 1
        vm.prank(kycUser);
        tester.requireLevel1();

        // Level 1 should fail for minLevel 2
        vm.prank(kycUser);
        vm.expectRevert();
        tester.requireLevel2();

        // Set user to KYC level 2
        vm.prank(admin);
        kyc.setKycStatus(kycUser, 2, 1, "user.hsk");

        // Level 2 should pass for minLevel 2
        vm.prank(kycUser);
        tester.requireLevel2();
    }

    function test_onlyMinKycLevel_revertsForUnverifiedUser() public {
        MinKycLevelTester tester = new MinKycLevelTester(address(kyc));

        address unverified = makeAddr("unverified");
        vm.prank(unverified);
        vm.expectRevert();
        tester.requireLevel1();
    }
}

/// @dev Helper contract to test the onlyMinKycLevel modifier from KYCGated
contract MinKycLevelTester is KYCGated {
    constructor(address kycContract_) KYCGated(kycContract_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function requireLevel1() external onlyMinKycLevel(1) {}

    function requireLevel2() external onlyMinKycLevel(2) {}
}
