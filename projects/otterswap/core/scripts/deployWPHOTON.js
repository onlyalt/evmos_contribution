const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  const WPHOTON = await hre.ethers.getContractFactory('WPHOTON')
  const token = await WPHOTON.deploy()
  await token.deployed()
  console.log('WPHOTON Contract deployed to:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })