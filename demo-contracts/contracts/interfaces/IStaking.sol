// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @dev Interface for the staking contract
 */
interface IStaking {

    /**
     * @dev Stake token
     */
    function stake() payable external;

    /**
     * @dev Stake token for other account
     */
    function stakeFor(address account) payable external;

    /**
     * @dev Withdraw user stake
     */
    function withdraw(uint amount) external;

    /**
     * @dev Emergency withdraw for user tokens losing rewards
     */
    function emergencyWithdraw(address to) external;

    /**
     * @dev Pauses/unpauses contract
     */
    function pause(bool _status) external;
}