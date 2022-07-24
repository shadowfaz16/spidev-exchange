const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, accounts, deployer;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Spidev Token", "SPDV", 420000000);

    accounts = await ethers.getSigners();
    deployer = accounts[0];
  });

  describe("Spidev Token Deployment", () => {
    const name = "Spidev Token";
    const symbol = "SPDV";
    const decimals = 18;
    const totalSupply = tokens(420000000);

    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct Total Supply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("assigns the Total Supply to the deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });
});
