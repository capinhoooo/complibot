// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NonCompliantVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        payable(msg.sender).transfer(amount);

        balances[msg.sender] -= amount;
    }

    function withdrawAll() public {
        uint256 amount = balances[msg.sender];
        payable(msg.sender).transfer(amount);
        balances[msg.sender] = 0;
    }

    function emergencyWithdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
