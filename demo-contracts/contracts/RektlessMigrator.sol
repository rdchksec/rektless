// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IStaking.sol";
import "./interfaces/IERC20.sol";

/**
 * @dev Contract for rektless liquidity migration
 */
contract RektlessMigrator {

    IStaking vulnContract;
    IERC20 vulnToken;
    IStaking fixedContract;

    constructor(address _vulnContract, address _fixedContract) {
        vulnContract = IStaking(_vulnContract);
        fixedContract = IStaking(_fixedContract);
        vulnToken = IERC20(_vulnContract);
    }

    /**
     * @dev Emergency withdraws user's tokens and stakes for it in fixed contract
     */
    function migrateToFixedContract() external {
        uint amount = vulnToken.balanceOf(msg.sender);
        vulnToken.transferFrom(msg.sender, address(this), amount);
        vulnContract.emergencyWithdraw(address(this));
        fixedContract.stakeFor{value:amount}(msg.sender);
    }

    /**
     * @dev Emergency withdraws tokens to user's account
     */
    function migrateToUserAddress() external {
        uint amount = vulnToken.balanceOf(msg.sender);
        vulnToken.transferFrom(msg.sender, address(this), amount);
        vulnContract.emergencyWithdraw(msg.sender);
    }
    
    fallback() external payable {

    }

    receive() external payable {

    }

}