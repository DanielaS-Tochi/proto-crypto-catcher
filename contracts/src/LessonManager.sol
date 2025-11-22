// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LessonManager {
    mapping(address => uint256) public points;

    event PointsAdded(address indexed user, uint256 amount);

    function addPoints(address user, uint256 amount) external {
        points[user] += amount;
        emit PointsAdded(user, amount);
    }
}
