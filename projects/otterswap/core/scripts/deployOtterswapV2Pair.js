const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  const OtterswapV2Pair = await hre.ethers.getContractFactory('OtterswapV2Pair')
  const factory = await OtterswapV2Pair.deploy()
  await factory.deployed()
  console.log('OtterswapV2Pair Contract deployed to:', factory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })