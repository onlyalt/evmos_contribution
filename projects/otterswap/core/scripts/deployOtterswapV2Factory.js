const hre = require('hardhat')

const FeeToSetter = '0x1c5E1c4FBAB6EF59cb3BE03cC0B22156e7b1475d';

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  const OtterswapV2Factory = await hre.ethers.getContractFactory('OtterswapV2Factory')
  const factory = await OtterswapV2Factory.deploy(FeeToSetter)
  await factory.deployed()
  console.log('OtterswapV2Factory Contract deployed to:', factory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })