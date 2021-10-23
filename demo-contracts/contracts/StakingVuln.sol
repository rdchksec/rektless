pragma solidity ^0.8.0;

import "./interfaces/IStaking.sol";
import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Vulnerable staking contract
 */
contract StakingVuln is ERC20, IStaking, Pausable, Ownable {

    event Exploited();

    constructor() ERC20("wTKN", "Governance tkn") {
        _mint(address(this), 1_000_000_000 * 10 ** 18);
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
        token.transfer(msg.sender, stakedBalances[msg.sender]);
    }

    /**
     * @dev Emergency withdraw for user tokens losing rewards
     */
    function emergencyWithdraw(address to) external whenNotPaused {
        stakedAmount = balanceOf(msg.sender);
        _transferFrom(msg.sender, address(this), stakedAmount);
        token.transfer(to, stakedAmount);
    }

    /**
     * @dev Simplification for contract hack - drains all tokens
     */
    function exploit() external whenNotPaused {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Exploited();
    }

    /**
     * @dev Pauses/unpauses contract
     */
    function pause(bool _status) external onlyOwner {
        if (_status == true){
            _pause();
        } else {
            _unpause();
        }
    }

}