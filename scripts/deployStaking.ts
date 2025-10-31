import { network } from "hardhat";

const { ethers } = await network.connect();

export async function deployStaking({
  tokenAddress,
  contractName,
}: {
  tokenAddress: string;
  contractName: string;
}) {
  const [deployer] = await ethers.getSigners();
  console.log(`\n🚀 Deploying ${contractName}...`);
  console.log("Deployer:", deployer.address);
  console.log("Using token:", tokenAddress);

  const Staking = await ethers.getContractFactory(contractName);
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();

  const stakingAddress = await staking.getAddress();
  console.log(`✅ ${contractName} deployed at: ${stakingAddress}`);

  return staking;
}
