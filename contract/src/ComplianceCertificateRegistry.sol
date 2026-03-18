// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IHashKeyKYC} from "./interfaces/IHashKeyKYC.sol";
import {KYCGated} from "./base/KYCGated.sol";

contract ComplianceCertificateRegistry is KYCGated, Pausable, ReentrancyGuard {
    struct Certificate {
        bytes32 id;
        address contractAddress;
        address developer;
        uint8 complianceScore;
        bytes32 auditHash;
        uint8 criticalFindings;
        uint8 highFindings;
        uint8 mediumFindings;
        uint8 lowFindings;
        uint256 issuedAt;
        bool revoked;
        string version;
    }

    struct IssueCertificateParams {
        address contractAddress;
        address developer;
        uint8 score;
        bytes32 auditHash;
        uint8 criticalFindings;
        uint8 highFindings;
        uint8 mediumFindings;
        uint8 lowFindings;
        string version;
    }

    error ZeroAddress();
    error ScoreBelowMinimum(uint8 score, uint8 minimum);
    error CriticalFindingsNotZero(uint8 criticalFindings);
    error CertificateNotFound(bytes32 certificateId);
    error CertificateAlreadyRevoked(bytes32 certificateId);
    error InvalidAuditHash();
    error ScoreAboveMaximum(uint8 score, uint8 maximum);

    event CertificateIssued(
        bytes32 indexed certificateId,
        address indexed contractAddress,
        address indexed developer,
        uint8 complianceScore,
        bytes32 auditHash,
        string version
    );
    event CertificateRevoked(bytes32 indexed certificateId, address indexed revokedBy);

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");
    uint8 public constant MINIMUM_SCORE = 70;
    uint8 public constant MAXIMUM_SCORE = 100;
    uint256 private _certificateNonce;

    mapping(bytes32 => Certificate) private _certificates;
    mapping(address => bytes32[]) private _certificatesByContract;
    mapping(address => bytes32[]) private _certificatesByDeveloper;
    mapping(address => bytes32) private _latestCertificate;

    constructor(address admin, address kycContract_) KYCGated(kycContract_) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function issueCertificate(IssueCertificateParams calldata params)
        external
        onlyRole(ATTESTER_ROLE)
        whenNotPaused
        nonReentrant
        returns (bytes32 certificateId)
    {
        if (params.contractAddress == address(0)) revert ZeroAddress();
        if (params.developer == address(0)) revert ZeroAddress();
        if (params.auditHash == bytes32(0)) revert InvalidAuditHash();
        if (params.score < MINIMUM_SCORE) revert ScoreBelowMinimum(params.score, MINIMUM_SCORE);
        if (params.score > MAXIMUM_SCORE) revert ScoreAboveMaximum(params.score, MAXIMUM_SCORE);
        if (params.criticalFindings != 0) {
            revert CriticalFindingsNotZero(params.criticalFindings);
        }

        (bool isValid,) = kycContract.isHuman(params.developer);
        if (!isValid) revert KYCNotVerified(params.developer);

        certificateId = _createCertificate(params);
    }

    function revokeCertificate(bytes32 certificateId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        Certificate storage cert = _certificates[certificateId];
        if (cert.issuedAt == 0) revert CertificateNotFound(certificateId);
        if (cert.revoked) revert CertificateAlreadyRevoked(certificateId);

        cert.revoked = true;

        if (_latestCertificate[cert.contractAddress] == certificateId) {
            _latestCertificate[cert.contractAddress] = bytes32(0);
        }

        emit CertificateRevoked(certificateId, msg.sender);
    }

    function isContractCertified(address contractAddress) external view returns (bool) {
        bytes32 latestId = _latestCertificate[contractAddress];
        if (latestId == bytes32(0)) return false;

        Certificate storage cert = _certificates[latestId];
        return cert.issuedAt > 0 && !cert.revoked;
    }

    function getCertificate(bytes32 certificateId) external view returns (Certificate memory) {
        Certificate storage cert = _certificates[certificateId];
        if (cert.issuedAt == 0) revert CertificateNotFound(certificateId);
        return cert;
    }

    function getCertificatesByContract(address contractAddress)
        external
        view
        returns (bytes32[] memory)
    {
        return _certificatesByContract[contractAddress];
    }

    function getCertificatesByDeveloper(address developer)
        external
        view
        returns (bytes32[] memory)
    {
        return _certificatesByDeveloper[developer];
    }

    function getLatestCertificateId(address contractAddress) external view returns (bytes32) {
        return _latestCertificate[contractAddress];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _createCertificate(IssueCertificateParams calldata params)
        internal
        returns (bytes32 certificateId)
    {
        unchecked {
            _certificateNonce++;
        }

        certificateId = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                params.contractAddress,
                params.developer,
                _certificateNonce
            )
        );

        Certificate storage cert = _certificates[certificateId];
        cert.id = certificateId;
        cert.contractAddress = params.contractAddress;
        cert.developer = params.developer;
        cert.complianceScore = params.score;
        cert.auditHash = params.auditHash;
        cert.criticalFindings = params.criticalFindings;
        cert.highFindings = params.highFindings;
        cert.mediumFindings = params.mediumFindings;
        cert.lowFindings = params.lowFindings;
        cert.issuedAt = block.timestamp;
        cert.revoked = false;
        cert.version = params.version;

        _certificatesByContract[params.contractAddress].push(certificateId);
        _certificatesByDeveloper[params.developer].push(certificateId);
        _latestCertificate[params.contractAddress] = certificateId;

        emit CertificateIssued(
            certificateId,
            params.contractAddress,
            params.developer,
            params.score,
            params.auditHash,
            params.version
        );
    }
}
