import { ethers } from "hardhat";
import { getExpectedContractAddress } from "./utils";

// import {
//   SPACToken,
//   SPACGovernor,
//   Timelock,
// } from "../src/types";

// import {
//   SPACToken__factory,
//   SPACGovernor__factory,
//   Timelock__factory,
// } from "../src/types/factories";


async function main() {
    const timelockDelay = 2;

    const tokenFactory = await ethers.getContractFactory("SPACToken");
  
    const signerAddress = await tokenFactory.signer.getAddress();
    const signer = await ethers.getSigner(signerAddress);
  
    console.log("Deploying contracts with the account:", signer.address);

    console.log("Account balance:", (await signer.getBalance()).toString());

    const governorExpectedAddress = await getExpectedContractAddress(signer);
  
    const token = await tokenFactory.deploy();
    await token.deployed();
  
    const timelockFactory = await ethers.getContractFactory("Timelock");
    const timelock = await timelockFactory.deploy(governorExpectedAddress, timelockDelay);
    await timelock.deployed();
  
    const governorFactory = await ethers.getContractFactory("SPACGovernor");
    const governor = await governorFactory.deploy(token.address, timelock.address);
    await governor.deployed();
  
    console.log("Dao deployed to: ", {
      governorExpectedAddress,
      governor: governor.address,
      timelock: timelock.address,
      token: token.address,
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
