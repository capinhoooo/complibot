// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CompliBotEAS} from "../src/CompliBotEAS.sol";
import {IEAS, ISchemaRegistry} from "../src/interfaces/IEAS.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

/// @dev Mock EAS that simulates the OP Stack predeploy behavior
contract MockEAS is IEAS {
    uint256 private _nonce;
    mapping(bytes32 => bool) private _revoked;

    function attest(AttestationRequest calldata) external payable returns (bytes32) {
        _nonce++;
        return keccak256(abi.encode("attestation", _nonce));
    }

    function revoke(RevocationRequest calldata request) external payable {
        _revoked[request.data.uid] = true;
    }

    function getAttestation(bytes32 uid) external view returns (Attestation memory) {
        return Attestation({
            uid: uid,
            schema: bytes32(0),
            time: uint64(block.timestamp),
            expirationTime: 0,
            revocationTime: _revoked[uid] ? uint64(block.timestamp) : 0,
            refUID: bytes32(0),
            attester: address(this),
            recipient: address(0),
            revocable: true,
            data: ""
        });
    }
}

/// @dev Mock Schema Registry that simulates the OP Stack predeploy behavior
contract MockSchemaRegistry is ISchemaRegistry {
    uint256 private _nonce;
    mapping(bytes32 => SchemaRecord) private _schemas;

    function register(string calldata schema, address resolver, bool revocable)
        external
        returns (bytes32)
    {
        _nonce++;
        bytes32 uid = keccak256(abi.encode("schema", _nonce));
        _schemas[uid] = SchemaRecord({
            uid: uid,
            resolver: resolver,
            revocable: revocable,
            schema: schema
        });
        return uid;
    }

    function getSchema(bytes32 uid) external view returns (SchemaRecord memory) {
        return _schemas[uid];
    }
}

contract CompliBotEASTest is Test {
    CompliBotEAS public easAdapter;
    MockEAS public mockEas;
    MockSchemaRegistry public mockSchemaRegistry;

    address public admin = makeAddr("admin");
    address public attester = makeAddr("attester");
    address public nobody = makeAddr("nobody");
    address public targetContract = makeAddr("targetContract");
    address public developer = makeAddr("developer");

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant CERT_ID = keccak256("certificate-1");
    bytes32 public constant AUDIT_HASH = keccak256("audit-report-v1");

    function setUp() public {
        // Deploy mock predeploys
        mockEas = new MockEAS();
        mockSchemaRegistry = new MockSchemaRegistry();

        // Deploy the adapter, but we need to place our mocks at the predeploy addresses.
        // Since CompliBotEAS hardcodes EAS_ADDRESS and SCHEMA_REGISTRY_ADDRESS as constants
        // and initializes them as immutables in the constructor, we use vm.etch to place
        // our mock code at the predeploy addresses BEFORE deploying CompliBotEAS.
        vm.etch(0x4200000000000000000000000000000000000021, address(mockEas).code);
        vm.etch(0x4200000000000000000000000000000000000020, address(mockSchemaRegistry).code);

        easAdapter = new CompliBotEAS(admin);

        // Grant attester role
        vm.prank(admin);
        easAdapter.grantRole(ATTESTER_ROLE, attester);
    }

    // --- Helpers ---

    function _defaultAttestParams() internal view returns (CompliBotEAS.AttestParams memory) {
        return CompliBotEAS.AttestParams({
            certificateId: CERT_ID,
            contractAddress: targetContract,
            developerAddress: developer,
            complianceScore: 85,
            auditHash: AUDIT_HASH,
            version: "1.0.0",
            criticalFindings: 0,
            highFindings: 1,
            mediumFindings: 2,
            lowFindings: 3
        });
    }

    function _registerSchema() internal {
        vm.prank(admin);
        easAdapter.registerSchema();
    }

    function _createAttestation() internal returns (bytes32) {
        _registerSchema();
        vm.prank(attester);
        return easAdapter.attest(_defaultAttestParams());
    }

    // --- Constructor Tests ---

    function test_constructor_setsAdmin() public view {
        assertTrue(easAdapter.hasRole(DEFAULT_ADMIN_ROLE, admin));
    }

    function test_constructor_revertsOnZeroAdmin() public {
        // Need the mocks etched at predeploy addresses (already done in setUp)
        vm.expectRevert(CompliBotEAS.ZeroAddress.selector);
        new CompliBotEAS(address(0));
    }

    function test_constructor_setsEasAddress() public view {
        assertEq(address(easAdapter.eas()), 0x4200000000000000000000000000000000000021);
    }

    function test_constructor_setsSchemaRegistryAddress() public view {
        assertEq(
            address(easAdapter.schemaRegistry()),
            0x4200000000000000000000000000000000000020
        );
    }

    // --- Schema Registration Tests ---

    function test_registerSchema_success() public {
        _registerSchema();
        assertTrue(easAdapter.schemaUid() != bytes32(0));
    }

    function test_registerSchema_emitsEvent() public {
        vm.prank(admin);
        vm.expectEmit(false, false, false, false);
        emit CompliBotEAS.SchemaRegistered(bytes32(0)); // We don't know the UID ahead of time
        easAdapter.registerSchema();
    }

    function test_registerSchema_revertsOnReRegistration() public {
        _registerSchema();

        vm.prank(admin);
        vm.expectRevert(CompliBotEAS.SchemaAlreadyRegistered.selector);
        easAdapter.registerSchema();
    }

    function test_registerSchema_revertsWithoutAdminRole() public {
        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                DEFAULT_ADMIN_ROLE
            )
        );
        easAdapter.registerSchema();
    }

    // --- Attestation Tests ---

    function test_attest_success() public {
        bytes32 uid = _createAttestation();
        assertTrue(uid != bytes32(0));

        // Verify mappings
        assertEq(easAdapter.certificateToAttestation(CERT_ID), uid);
        assertEq(easAdapter.attestationToCertificate(uid), CERT_ID);
    }

    function test_attest_emitsEvent() public {
        _registerSchema();

        CompliBotEAS.AttestParams memory params = _defaultAttestParams();

        vm.prank(attester);
        vm.expectEmit(false, true, true, true);
        emit CompliBotEAS.ComplianceAttested(
            bytes32(0), // attestation UID unknown ahead of time
            CERT_ID,
            targetContract,
            developer,
            85
        );
        easAdapter.attest(params);
    }

    function test_attest_revertsWithoutAttesterRole() public {
        _registerSchema();

        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                ATTESTER_ROLE
            )
        );
        easAdapter.attest(_defaultAttestParams());
    }

    function test_attest_revertsWithoutSchema() public {
        // Do NOT register schema
        vm.prank(attester);
        vm.expectRevert(CompliBotEAS.SchemaNotRegistered.selector);
        easAdapter.attest(_defaultAttestParams());
    }

    function test_attest_revertsOnZeroContractAddress() public {
        _registerSchema();

        CompliBotEAS.AttestParams memory params = _defaultAttestParams();
        params.contractAddress = address(0);

        vm.prank(attester);
        vm.expectRevert(CompliBotEAS.ZeroAddress.selector);
        easAdapter.attest(params);
    }

    function test_attest_revertsOnZeroDeveloperAddress() public {
        _registerSchema();

        CompliBotEAS.AttestParams memory params = _defaultAttestParams();
        params.developerAddress = address(0);

        vm.prank(attester);
        vm.expectRevert(CompliBotEAS.ZeroAddress.selector);
        easAdapter.attest(params);
    }

    function test_attest_revertsOnDuplicateCertificate() public {
        _createAttestation();

        // Try to attest the same certificate ID again
        vm.prank(attester);
        vm.expectRevert(
            abi.encodeWithSelector(
                CompliBotEAS.CertificateAlreadyAttested.selector, CERT_ID
            )
        );
        easAdapter.attest(_defaultAttestParams());
    }

    function test_attest_multipleDifferentCertificates() public {
        _registerSchema();

        // First attestation
        vm.prank(attester);
        bytes32 uid1 = easAdapter.attest(_defaultAttestParams());

        // Second attestation with different certificate ID
        CompliBotEAS.AttestParams memory params2 = _defaultAttestParams();
        params2.certificateId = keccak256("certificate-2");

        vm.prank(attester);
        bytes32 uid2 = easAdapter.attest(params2);

        assertTrue(uid1 != uid2);
        assertEq(easAdapter.certificateToAttestation(CERT_ID), uid1);
        assertEq(easAdapter.certificateToAttestation(keccak256("certificate-2")), uid2);
    }

    // --- Revocation Tests ---

    function test_revokeAttestation_success() public {
        bytes32 uid = _createAttestation();

        vm.prank(admin);
        vm.expectEmit(true, true, false, false);
        emit CompliBotEAS.AttestationRevoked(uid, CERT_ID);
        easAdapter.revokeAttestation(CERT_ID);
    }

    function test_revokeAttestation_revertsWithoutAdminRole() public {
        _createAttestation();

        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                DEFAULT_ADMIN_ROLE
            )
        );
        easAdapter.revokeAttestation(CERT_ID);
    }

    function test_revokeAttestation_revertsOnNotFound() public {
        _registerSchema();

        bytes32 unknownCertId = keccak256("nonexistent");

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                CompliBotEAS.AttestationNotFound.selector, bytes32(0)
            )
        );
        easAdapter.revokeAttestation(unknownCertId);
    }

    // --- View Function Tests ---

    function test_getAttestationUid_returnsCorrectUid() public {
        bytes32 uid = _createAttestation();
        assertEq(easAdapter.getAttestationUid(CERT_ID), uid);
    }

    function test_getAttestationUid_returnsZeroForUnknown() public view {
        assertEq(easAdapter.getAttestationUid(keccak256("unknown")), bytes32(0));
    }

    function test_getCertificateId_returnsCorrectId() public {
        bytes32 uid = _createAttestation();
        assertEq(easAdapter.getCertificateId(uid), CERT_ID);
    }

    function test_getCertificateId_returnsZeroForUnknown() public view {
        assertEq(easAdapter.getCertificateId(keccak256("unknown")), bytes32(0));
    }

    // --- Pause/Unpause Tests ---

    function test_pause_preventsAttestation() public {
        _registerSchema();

        vm.prank(admin);
        easAdapter.pause();

        vm.prank(attester);
        vm.expectRevert();
        easAdapter.attest(_defaultAttestParams());
    }

    function test_pause_preventsRevocation() public {
        bytes32 uid = _createAttestation();
        assertTrue(uid != bytes32(0));

        vm.prank(admin);
        easAdapter.pause();

        vm.prank(admin);
        vm.expectRevert();
        easAdapter.revokeAttestation(CERT_ID);
    }

    function test_unpause_allowsOperations() public {
        _registerSchema();

        vm.prank(admin);
        easAdapter.pause();

        vm.prank(admin);
        easAdapter.unpause();

        // Should work again
        vm.prank(attester);
        bytes32 uid = easAdapter.attest(_defaultAttestParams());
        assertTrue(uid != bytes32(0));
    }

    function test_pause_revertsWithoutAdminRole() public {
        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                DEFAULT_ADMIN_ROLE
            )
        );
        easAdapter.pause();
    }

    function test_unpause_revertsWithoutAdminRole() public {
        vm.prank(admin);
        easAdapter.pause();

        vm.prank(nobody);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nobody,
                DEFAULT_ADMIN_ROLE
            )
        );
        easAdapter.unpause();
    }

    // --- Schema Registration does not require pause check ---

    function test_registerSchema_worksWhilePaused() public {
        // Pause first, then try to register schema
        // registerSchema is not gated by whenNotPaused, so this should work
        vm.prank(admin);
        easAdapter.pause();

        vm.prank(admin);
        easAdapter.registerSchema();
        assertTrue(easAdapter.schemaUid() != bytes32(0));
    }
}
