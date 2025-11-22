// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Lesson1.sol";

contract Lesson1Test is Test {
    Lesson1 public lesson1;

    function setUp() public {
        lesson1 = new Lesson1();
    }

    function testMessage() public {
        assertEq(lesson1.getMessage(), "Hello Ethereum");
    }
}
