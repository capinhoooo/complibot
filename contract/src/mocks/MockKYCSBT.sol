// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHashKeyKYC} from "../interfaces/IHashKeyKYC.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockKYCSBT is IHashKeyKYC, Ownable {
    error ZeroAddress();
    error InsufficientFee();

    event KycStatusSet(address indexed account, uint8 level, uint8 status);
    event KycRequested(address indexed account, string ensName);
    event FeeUpdated(uint256 newFee);

    struct KycData {
        string ensName;
        uint8 level;
        uint8 status;
        uint256 createTime;
    }

    mapping(address => KycData) private _kycData;
    mapping(address => mapping(string => bool)) private _approvedEnsNames;
    
    uint256 private _totalFee;

    constructor(address owner_) Ownable(owner_) {}

    function setKycStatus(address account, uint8 level, uint8 status, string calldata ensName)
        external
        onlyOwner
    {
        if (account == address(0)) revert ZeroAddress();

        _kycData[account] = KycData({
            ensName: ensName,
            level: level,
            status: status,
            createTime: block.timestamp
        });

        if (bytes(ensName).length > 0) {
            _approvedEnsNames[account][ensName] = true;
        }

        emit KycStatusSet(account, level, status);
    }

    function setFee(uint256 fee) external onlyOwner {
        _totalFee = fee;
        emit FeeUpdated(fee);
    }

    function isHuman(address account) external view returns (bool isValid, uint8 level) {
        KycData storage data = _kycData[account];
        level = data.level;
        isValid = level > 0;
    }

    function getKycInfo(address account)
        external
        view
        returns (string memory ensName, uint8 level, uint8 status, uint256 createTime)
    {
        KycData storage data = _kycData[account];
        return (data.ensName, data.level, data.status, data.createTime);
    }

    function getTotalFee() external view returns (uint256) {
        return _totalFee;
    }

    function requestKyc(string memory ensName) external payable {
        if (msg.value < _totalFee) revert InsufficientFee();

        _kycData[msg.sender] = KycData({
            ensName: ensName,
            level: 1,
            status: 1,
            createTime: block.timestamp
        });
        _approvedEnsNames[msg.sender][ensName] = true;

        emit KycRequested(msg.sender, ensName);
    }

    function isEnsNameApproved(address user, string memory ensName) external view returns (bool) {
        return _approvedEnsNames[user][ensName];
    }
}
