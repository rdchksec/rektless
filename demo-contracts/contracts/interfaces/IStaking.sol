pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IStaking {

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

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
    function withdraw() external;

    /**
     * @dev Emergency withdraw for user tokens losing rewards
     */
    function emergencyWithdraw(address to) external;

    /**
     * @dev Pauses/unpauses contract
     */
    function pause(bool _status) external;
}