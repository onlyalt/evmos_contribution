const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  const OtterswapV2ERC20 = await hre.ethers.getContractFactory('OtterswapV2ERC20')
  const factory = await OtterswapV2ERC20.deploy()
  await factory.deployed()
  console.log('OtterswapV2ERC20 Contract deployed to:', factory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })