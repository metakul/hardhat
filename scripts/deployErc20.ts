import { network } from "hardhat";

const { ethers } = await network.connect();
const contractName = "CustomToken";
const tokenName = "MetaCoin";
const tokenSymbol = "MTC";
const initialSupply = ethers.parseEther("1000000"); // 1 million tokens

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);

  const Token = await ethers.getContractFactory(contractName);
  const token = await Token.deploy(tokenName, tokenSymbol, initialSupply);
  await token.waitForDeployment();

  console.log(
    `✅ ${tokenName} (${tokenSymbol}) deployed to:`,
    await token.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
