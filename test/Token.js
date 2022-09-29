const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, accounts, deployer, reciever;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Spidev Token", "SPDV", 420000000);

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    reciever = accounts[1];
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

  describe("Sending Tokens", () => {
    let amount, transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = tokens(100);
        // Transfer tokens
        transaction = await token
          .connect(deployer)
          .transfer(reciever.address, amount);
        result = await transaction.wait();
      });

      it("transfers Token Balances", async () => {
        // Ensure tokens were transfered (balance changed)
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(419999900),
        );
        expect(await token.balanceOf(reciever.address)).to.equal(amount);
      });

      it("emits a Transfer Event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(reciever.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects insufficient balances", async () => {
        // Transfer more tokens than deployer has = 10M
        const invalidAmount = tokens(1000000000);
        await expect(
          token.connect(deployer).transfer(reciever.address, invalidAmount),
        ).to.be.reverted;
      });
      it("rejects invalid recipent", async () => {
        const amount = tokens(100);
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount),
        ).to.be.reverted;
      });
    });
  });
});
