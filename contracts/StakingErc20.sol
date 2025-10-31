// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public stakingToken;
    
    uint256 public constant ROI_BASIS_POINTS = 100; // 1% = 100 basis points
    uint256 public constant REFERRAL_BASIS_POINTS = 50; // 0.5% = 50 basis points
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;
    uint256 public constant CLAIM_INTERVAL = 1 days;

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
    event Withdrawn(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 reward);

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

                // @dev 0.5% referral reward (50 basis points)
                // @user 0.5% of the referee’s deposit paid immediately to the referrer.

                uint256 reward = (amount * REFERRAL_BASIS_POINTS) / BASIS_POINTS_DIVISOR;
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

    /// @notice Withdraw your staked amount (no rewards for will be claimed if withdrawn )
    function withdraw(uint256 amount) external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(s.amount >= amount && amount > 0, "invalid amount");

        // ✅ First update the state
        s.amount -= amount;

        // ✅ Then transfer tokens (safe order)
        stakingToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }


    /// @notice 💰 Claim ROI (1% every 24h)
    function claim() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(s.amount > 0, "no active stake");
        require(block.timestamp >= s.lastClaimAt + CLAIM_INTERVAL, "claim too soon");

        // 1% of staked principal using bps for better precision
        uint256 reward = (s.amount * ROI_BASIS_POINTS) / BASIS_POINTS_DIVISOR;
        require(stakingToken.balanceOf(address(this)) >= reward, "insufficient reward pool");

        // update state BEFORE transfer (safety)
        s.lastClaimAt = block.timestamp;

        stakingToken.transfer(msg.sender, reward);
        emit Claimed(msg.sender, reward);
    }
}
