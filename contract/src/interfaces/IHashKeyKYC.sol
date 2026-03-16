// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IHashKeyKYC {
    function isHuman(address account) external view returns (bool isValid, uint8 level);
    function getKycInfo(address account)
        external
        view
        returns (string memory ensName, uint8 level, uint8 status, uint256 createTime);
    function getTotalFee() external view returns (uint256);
    function requestKyc(string memory ensName) external payable;
    function isEnsNameApproved(address user, string memory ensName) external view returns (bool);
}
