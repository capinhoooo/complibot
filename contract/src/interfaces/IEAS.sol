// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEAS {
    struct AttestationRequestData {
        address recipient;
        uint64 expirationTime;
        bool revocable;
        bytes32 refUID;
        bytes data;
        uint256 value;
    }

    struct AttestationRequest {
        bytes32 schema;
        AttestationRequestData data;
    }

    struct RevocationRequestData {
        bytes32 uid;
        uint256 value;
    }

    struct RevocationRequest {
        bytes32 schema;
        RevocationRequestData data;
    }

    struct Attestation {
        bytes32 uid;
        bytes32 schema;
        uint64 time;
        uint64 expirationTime;
        uint64 revocationTime;
        bytes32 refUID;
        address attester;
        address recipient;
        bool revocable;
        bytes data;
    }

    function attest(AttestationRequest calldata request) external payable returns (bytes32);
    function revoke(RevocationRequest calldata request) external payable;
    function getAttestation(bytes32 uid) external view returns (Attestation memory);
}

interface ISchemaRegistry {
    struct SchemaRecord {
        bytes32 uid;
        address resolver;
        bool revocable;
        string schema;
    }

    function register(string calldata schema, address resolver, bool revocable)
        external
        returns (bytes32);
    function getSchema(bytes32 uid) external view returns (SchemaRecord memory);
}
