// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHashKeyKYC} from "../interfaces/IHashKeyKYC.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract KYCGated is AccessControl {
    error KYCNotVerified(address account);
    error KYCInsufficientLevel(address account, uint8 required, uint8 actual);
    error KYCContractZeroAddress();

    event KYCContractUpdated(address indexed oldKycContract, address indexed newKycContract);

    IHashKeyKYC public kycContract;

    modifier onlyVerifiedHuman() {
        (bool isValid,) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        _;
    }

    modifier onlyMinKycLevel(uint8 minLevel) {
        (bool isValid, uint8 level) = kycContract.isHuman(msg.sender);
        if (!isValid) revert KYCNotVerified(msg.sender);
        if (level < minLevel) revert KYCInsufficientLevel(msg.sender, minLevel, level);
        _;
    }

    constructor(address kycContract_) {
        if (kycContract_ == address(0)) revert KYCContractZeroAddress();
        kycContract = IHashKeyKYC(kycContract_);
    }


    function setKycContract(address newKycContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newKycContract == address(0)) revert KYCContractZeroAddress();
        address old = address(kycContract);
        kycContract = IHashKeyKYC(newKycContract);
        emit KYCContractUpdated(old, newKycContract);
    }
}
