// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IStaking.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Vulnerable staking contract
 */
contract StakingFixed is ERC20, Pausable, Ownable {

    IERC20 token;

    constructor(address _token) ERC20("wTKN", "Governance tkn") {
        _mint(address(this), 1_000_000_000 * 10 ** 18);
        token = IERC20(_token);
    }

    /**
     * @dev Stake token
     */
    function stake(uint amount) external whenNotPaused {
        token.transferFrom(msg.sender, address(this), amount);
        _transfer(address(this), msg.sender, amount);
    }

    /**
     * @dev Stake token for other account
     */
    function stakeFor(uint amount, address account) external whenNotPaused {
        token.transferFrom(msg.sender, address(this), amount);
        _transfer(address(this), account, amount);
    }

    /**
     * @dev Withdraw user stake
     */
    function withdraw(uint amount) external whenNotPaused {
        // _transferFrom(msg.sender, address(this), amount);
        token.transfer(msg.sender, amount);
    }

    /**
     * @dev Emergency withdraw for user tokens losing rewards
     */
    function emergencyWithdraw(address to) external whenNotPaused {
        uint stakedAmount = balanceOf(msg.sender);
        _transfer(msg.sender, address(this), stakedAmount);
        token.transfer(to, stakedAmount);
    }

    /**
     * @dev Pauses/unpauses contract
     */
    function pause(bool _status) external onlyOwner {
        if (_status == true){
            super._pause();
        } else {
            super._unpause();
        }
    }

}