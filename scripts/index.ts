import { network } from "hardhat";
import { deployErc20 } from "./deployErc20.js";
import { deployStaking } from "./deployStaking.js";

// connect to network
const { ethers } = await network.connect();

async function main() {
  // ─────────── Config ───────────
  const config = {
    token: {
      contractName: "CustomToken",
      tokenName: "MetaCoin",
      tokenSymbol: "MTC",
      initialSupply: ethers.parseEther("1000000"),
    },
    staking: {
      contractName: "Staking",
    },
    fundAmount: ethers.parseEther("10000"),
  };

  // ─────────── 1️⃣ Deploy ERC20 ───────────
  const token = await deployErc20(config.token);
  const tokenAddress = await token.getAddress();

  // ─────────── 2️⃣ Deploy Staking ───────────
  const staking = await deployStaking({
    tokenAddress,
    contractName: config.staking.contractName,
  });
  const stakingAddress = await staking.getAddress();

  // ─────────── 3️⃣ Fund staking pool (optional) ───────────
  const [deployer] = await ethers.getSigners();
  const tx = await token
    .connect(deployer)
    .transfer(stakingAddress, config.fundAmount);
  await tx.wait();

  console.log(
    `💰 Funded staking pool with ${ethers.formatEther(config.fundAmount)} MTC`
  );

  console.log("\n✅ Deployment Summary:");
  console.log("Token:", tokenAddress);
  console.log("Staking:", stakingAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
