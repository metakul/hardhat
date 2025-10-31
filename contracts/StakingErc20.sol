// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public stakingToken;

    struct StakeInfo {
        uint256 amount; // principal
        uint256 startedAt; // when stake started or last deposit
        uint256 lastClaimAt; // last time ROI was claimed
    }

    mapping(address => StakeInfo) public stakes;

    // referral tracking (can be used for stats)
    mapping(address => address) public referrers;

    event Deposited(
        address indexed user,
        uint256 amount,
        address indexed referrer
    );
    event ReferralReward(
        address indexed referrer,
        address indexed user,
        uint256 reward
    );

    constructor(IERC20 _token) {
        stakingToken = _token;
    }

    /// @notice deposit tokens to stake. Must `approve` the contract first.
    /// @param amount amount to stake (in token smallest units)
    /// @param referrer optional referrer address (can be address(0))
    function deposit(uint256 amount, address referrer) external nonReentrant {
        require(amount > 0, "zero amount");

        // transfer tokens from user to this contract
        stakingToken.transferFrom(msg.sender, address(this), amount);

        StakeInfo storage s = stakes[msg.sender];

        // if first time staking
        if (s.amount == 0) {
            s.startedAt = block.timestamp;
            s.lastClaimAt = block.timestamp;

            // register valid referrer (not self, not 0)
            if (referrer != address(0) && referrer != msg.sender) {
                referrers[msg.sender] = referrer;

                // 0.5% referral reward (50 basis points)
                uint256 reward = (amount * 5) / 1000;
                if (
                    reward > 0 &&
                    stakingToken.balanceOf(address(this)) >= reward
                ) {
                    stakingToken.transfer(referrer, reward);
                    emit ReferralReward(referrer, msg.sender, reward);
                }
            }
        }

        // update staking amount
        s.amount += amount;
        s.startedAt = block.timestamp;

        emit Deposited(msg.sender, amount, referrer);
    }
}
