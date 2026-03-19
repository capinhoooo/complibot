// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IEAS, ISchemaRegistry} from "./interfaces/IEAS.sol";

contract CompliBotEAS is AccessControl, Pausable, ReentrancyGuard {
    struct AttestParams {
        bytes32 certificateId;
        address contractAddress;
        address developerAddress;
        uint8 complianceScore;
        bytes32 auditHash;
        string version;
        uint8 criticalFindings;
        uint8 highFindings;
        uint8 mediumFindings;
        uint8 lowFindings;
    }

    error ZeroAddress();
    error SchemaNotRegistered();
    error AttestationFailed();
    error AttestationNotFound(bytes32 uid);
    error CertificateAlreadyAttested(bytes32 certificateId);
    error SchemaAlreadyRegistered();

    event SchemaRegistered(bytes32 indexed schemaUid);
    event ComplianceAttested(
        bytes32 indexed attestationUid,
        bytes32 indexed certificateId,
        address indexed contractAddress,
        address developerAddress,
        uint8 complianceScore
    );
    event AttestationRevoked(bytes32 indexed attestationUid, bytes32 indexed certificateId);


    address public constant EAS_ADDRESS = 0x4200000000000000000000000000000000000021;
    address public constant SCHEMA_REGISTRY_ADDRESS = 0x4200000000000000000000000000000000000020;
    string public constant COMPLIANCE_SCHEMA =
        "address contractAddress, address developerAddress, uint8 complianceScore, "
        "bytes32 auditHash, string version, uint8 criticalFindings, uint8 highFindings, "
        "uint8 mediumFindings, uint8 lowFindings";

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    bytes32 public schemaUid;
    IEAS public immutable eas;
    ISchemaRegistry public immutable schemaRegistry;

    mapping(bytes32 => bytes32) public certificateToAttestation;
    mapping(bytes32 => bytes32) public attestationToCertificate;

    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);

        eas = IEAS(EAS_ADDRESS);
        schemaRegistry = ISchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
    }

    function registerSchema() external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (schemaUid != bytes32(0)) revert SchemaAlreadyRegistered();
        schemaUid = schemaRegistry.register(COMPLIANCE_SCHEMA, address(0), true);
        emit SchemaRegistered(schemaUid);
    }

    function attest(AttestParams calldata params)
        external
        onlyRole(ATTESTER_ROLE)
        whenNotPaused
        nonReentrant
        returns (bytes32 attestationUid)
    {
        if (schemaUid == bytes32(0)) revert SchemaNotRegistered();
        if (params.contractAddress == address(0)) revert ZeroAddress();
        if (params.developerAddress == address(0)) revert ZeroAddress();
        if (certificateToAttestation[params.certificateId] != bytes32(0)) {
            revert CertificateAlreadyAttested(params.certificateId);
        }

        attestationUid = _createAttestation(params);
    }

    function revokeAttestation(bytes32 certificateId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        bytes32 attestationUid = certificateToAttestation[certificateId];
        if (attestationUid == bytes32(0)) revert AttestationNotFound(attestationUid);

        IEAS.RevocationRequest memory request = IEAS.RevocationRequest({
            schema: schemaUid,
            data: IEAS.RevocationRequestData({uid: attestationUid, value: 0})
        });

        eas.revoke(request);

        emit AttestationRevoked(attestationUid, certificateId);
    }

    function getAttestationUid(bytes32 certificateId) external view returns (bytes32) {
        return certificateToAttestation[certificateId];
    }

    function getCertificateId(bytes32 attestationUid) external view returns (bytes32) {
        return attestationToCertificate[attestationUid];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _createAttestation(AttestParams calldata params)
        internal
        returns (bytes32 attestationUid)
    {
        bytes memory attestationData = abi.encode(
            params.contractAddress,
            params.developerAddress,
            params.complianceScore,
            params.auditHash,
            params.version,
            params.criticalFindings,
            params.highFindings,
            params.mediumFindings,
            params.lowFindings
        );

        IEAS.AttestationRequest memory request = IEAS.AttestationRequest({
            schema: schemaUid,
            data: IEAS.AttestationRequestData({
                recipient: params.contractAddress,
                expirationTime: 0, 
                revocable: true,
                refUID: bytes32(0),
                data: attestationData,
                value: 0
            })
        });

        attestationUid = eas.attest(request);
        certificateToAttestation[params.certificateId] = attestationUid;
        attestationToCertificate[attestationUid] = params.certificateId;

        emit ComplianceAttested(
            attestationUid,
            params.certificateId,
            params.contractAddress,
            params.developerAddress,
            params.complianceScore
        );
    }
}
