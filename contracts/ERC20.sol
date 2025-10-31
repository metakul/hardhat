// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CustomToken is ERC20, Ownable,ReentrancyGuard {
    event TokensRecovered(address indexed token, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) Ownable(msg.sender) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply);
    }

    /// @notice 🚨 Recover tokens accidentally sent to this contract (except staking token)
    function recoverTokens(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "invalid amount");

        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }
}
