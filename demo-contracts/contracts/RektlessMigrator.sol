// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IStaking.sol";
import "./interfaces/IERC20.sol";

/**
 * @dev Vulnerable staking contract
 */
contract RektlessMigrator {

    IStaking vulnContract;
    IERC20 vulnToken;
    IStaking fixedContract;
    IERC20 token;

    constructor(address _vulnContract, address _fixedContract, address _token) {
        vulnContract = IStaking(_vulnContract);
        fixedContract = IStaking(_fixedContract);
        token = IERC20(_token);
        vulnToken = IERC20(_vulnContract);
    }

    /**
     * @dev Emergency withdraws user's tokens and stakes for it in fixed contract
     */
    function migrateToFixedContract() external {
        uint amount = vulnToken.balanceOf(msg.sender);
        vulnContract.emergencyWithdraw(address(this));
        token.approve(address(fixedContract), amount);
        fixedContract.stakeFor(amount, msg.sender);
    }

    /**
     * @dev Emergency withdraws tokens to user's account
     */
    function migrateToUserAddress() external {
        vulnContract.emergencyWithdraw(msg.sender);
    }

}