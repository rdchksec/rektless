// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IStaking {

    /**
     * @dev Stake token
     */
    function stake(uint amount) external;

    /**
     * @dev Stake token for other account
     */
    function stakeFor(uint amount, address account) external;

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