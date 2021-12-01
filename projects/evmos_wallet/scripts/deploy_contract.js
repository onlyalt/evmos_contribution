const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  //console.log('Deploying contracts with the account:', deployer.address)

  const AltToken = await hre.ethers.getContractFactory('OtterCoin')
  const token = await AltToken.deploy(1000000)
  await token.deployed()
  console.log('OtterCoin Contract deployed to:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })