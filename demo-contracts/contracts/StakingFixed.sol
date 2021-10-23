// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IStaking.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Fixed staking contract
 */
contract StakingFixed is ERC20, Pausable, Ownable {

    constructor() ERC20("wTKN", "Governance tkn") {
        _mint(address(this), 1_000_000_000 * 10 ** 18);
    }

    /**
     * @dev Stake token
     */
    function stake() payable external whenNotPaused {
        super._transfer(address(this), msg.sender, msg.value);
    }

    /**
     * @dev Stake token for other account
     */
    function stakeFor(address account) payable external whenNotPaused {
        super._transfer(address(this), account, msg.value);
    }

    /**
     * @dev Withdraw user stake
     */
    function withdraw(uint amount) external whenNotPaused {
        uint stakedAmount = super.balanceOf(msg.sender);
        require(amount < stakedAmount);
        super._transfer(msg.sender, address(this), amount);
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    /**
     * @dev Emergency withdraw for user tokens losing rewards
     */
    function emergencyWithdraw(address to) external whenNotPaused {
        uint stakedAmount = super.balanceOf(msg.sender);
        super._transfer(msg.sender, address(this), stakedAmount);
        (bool sent, ) = to.call{value: stakedAmount}("");
        require(sent, "Failed to send Ether");
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