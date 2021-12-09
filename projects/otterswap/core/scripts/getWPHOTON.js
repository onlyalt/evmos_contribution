const hre = require('hardhat')

const WPHOTON_ADDRESS = '0x430166D3Ea1848760513E404105a3827C58e3247';
const CONTRACT_WPHOTON = '0xea2bcC97282e6755E198dCaCF81D5f90C30F05Bf';

async function main() {
  const token = await hre.ethers.getContractFactory('WPHOTON')

  const wPhoton = token.attach(WPHOTON_ADDRESS)
  const totalSupply = await wPhoton.totalSupply()
  console.log("Total Supply: " + totalSupply)
  console.log('Depositing wPHOTON:' + ethers.utils.parseEther('1000'));
  await wPhoton.deposit({value: ethers.utils.parseEther('1000')})
  const totalSupplyAfterTrade = await wPhoton.totalSupply()
  console.log("Total Supply: " + totalSupplyAfterTrade)
  await wPhoton.withdraw(1000)
  const totalSupplyAfterWithdrawal = await wPhoton.totalSupply()
  console.log("Total Supply: " + totalSupplyAfterWithdrawal)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })