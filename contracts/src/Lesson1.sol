// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Lesson1 {
    string public message = "Hello Ethereum";

    function getMessage() public view returns (string memory) {
        return message;
    }
}
