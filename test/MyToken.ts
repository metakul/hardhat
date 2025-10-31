import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MyToken", function () {
  it("Should assign total supply to the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("CustomToken");
    const token:any = await Token.deploy("myTOken","tkn",ethers.parseEther("1000"));
    await token.waitForDeployment();

    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);

    await token.transfer(addr1.address, ethers.parseEther("100"));
    
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
  });
});
