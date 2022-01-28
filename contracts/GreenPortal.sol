// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
// import "../node_modules/hardhat/console.sol";

contract GreenPortal {
    uint256 totalGreens;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function sendGreen() public {
        totalGreens += 1;
        console.log("%s has sent a green!", msg.sender);
    }

    function getTotalGreens() public view returns (uint256) {
        console.log("We have %d total greens!", totalGreens);
        return totalGreens;
    }
}