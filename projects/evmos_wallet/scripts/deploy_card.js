const { utils } = require("ethers");
const hre = require('hardhat');

async function main() {
    const baseTokenURI = "ipfs://QmPhWZugXEKTVTGj3oJQKi8bQVg4Bcx6y4PvULCrCZFjri/";
    console.log(baseTokenURI);
    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();
    console.log(owner);

    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("Card");
     console.log("Contract factory");

    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy(baseTokenURI);
    console.log("Contract");

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);

    // Mint 1 NFTs by sending 0.0001 ether
    const txn = await contract.mintNFTs(1, { value: utils.parseEther('0.0001') });
    await txn.wait()

    // Get all token IDs of the owner
    let tokens = await contract.tokensOfOwner(owner.address)
    console.log("Owner has tokens: ", tokens);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });