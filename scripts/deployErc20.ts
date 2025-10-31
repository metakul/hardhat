import { network } from "hardhat";

const { ethers } = await network.connect();

export async function deployErc20({
  contractName,
  tokenName,
  tokenSymbol,
  initialSupply,
}: {
  contractName: string;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: bigint;
}) {
  const [deployer] = await ethers.getSigners();
  console.log(`\n🚀 Deploying ERC20 (${tokenName})...`);
  console.log("Deployer:", deployer.address);

  const Token = await ethers.getContractFactory(contractName);
  const token = await Token.deploy(tokenName, tokenSymbol, initialSupply);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log(`✅ ${tokenName} (${tokenSymbol}) deployed at: ${tokenAddress}`);

  return token;
}
