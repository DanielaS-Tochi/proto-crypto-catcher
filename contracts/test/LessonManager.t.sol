// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/LessonManager.sol";

contract LessonManagerTest is Test {
    LessonManager public lessonManager;

    function setUp() public {
        lessonManager = new LessonManager();
    }

    function testAddPoints() public {
        address user = address(0x123);
        uint256 amount = 100;

        lessonManager.addPoints(user, amount);
        assertEq(lessonManager.points(user), amount);
    }

    function testAddPointsCumulative() public {
        address user = address(0x123);
        lessonManager.addPoints(user, 50);
        lessonManager.addPoints(user, 25);
        assertEq(lessonManager.points(user), 75);
    }
}
