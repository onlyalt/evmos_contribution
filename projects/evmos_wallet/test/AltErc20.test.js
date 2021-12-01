const { expect } = require("chai");
const { ethers } = require("hardhat");

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

describe("AltErc20", function () {
  it("Should return the new greeting once it's changed", async function () {
    const AltErc20 = await ethers.getContractFactory("AltErc20");
    const alterc20 = await AltErc20.deploy("Hello, world!");
    await alterc20.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });


});
