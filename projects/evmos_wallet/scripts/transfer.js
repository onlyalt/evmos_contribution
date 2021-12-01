const hre = require('hardhat')
const Web3 = require("web3")

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const SENDER_ADDRESS = '0xdd2fd4581271e230360230f9337d5c0430bf44c0'
const RECEIVER_ADDRESS = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
const amount = web3.utils.toWei('1000', 'ether')

async function main() {
  const token = await hre.ethers.getContractFactory('OtterCoin')

  const altToken = token.attach(CONTRACT_ADDRESS)
  await altToken.transfer(RECEIVER_ADDRESS, amount)
  console.log('%s ALT tokens transfered from %s to %s', amount, SENDER_ADDRESS, RECEIVER_ADDRESS)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })