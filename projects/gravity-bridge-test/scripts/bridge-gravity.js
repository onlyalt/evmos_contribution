require("dotenv").config();
import {COSMOS_ADDRESS,
    privKey,
    apiKey} from './constants'

const gravity = require('../abis/Gravity.json')
const erc20 = require('../abis/erc20.json')
const { ethers } = require("ethers");

const GRAVITY_BRIDGE_ADDRESS = '0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906'
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' 

const AMOUNT = '0.003'
const numberOfTokens = ethers.utils.parseUnits(AMOUNT, 18);
console.log(numberOfTokens)

const loadWalletAlchemy = (privKey, apiKey) => {
    const provider = new ethers.providers.AlchemyProvider(null, apiKey)
    const wallet = new ethers.Wallet(privKey, provider);
    return [provider, wallet]
  }

async function main() {

    const [provider, wallet] = loadWalletAlchemy(privKey, apiKey)
    const gravityContract = new ethers.Contract(GRAVITY_BRIDGE_ADDRESS, gravity.abi, wallet);
    const erc20Contract = new ethers.Contract(WETH_ADDRESS, erc20.abi,wallet)

    const approvalResponse = await erc20Contract.approve(GRAVITY_BRIDGE_ADDRESS, numberOfTokens)

    console.log(approvalResponse)

    console.log('===================================================')
    console.log('===================================================')
    console.log('===================================================')

    const transactionOptions = {
        gasLimit: 300000,
        gasPrice: ethers.utils.parseUnits('110.0', 'gwei')
    }

    const response = await gravityContract.sendToCosmos(WETH_ADDRESS, COSMOS_ADDRESS, numberOfTokens, transactionOptions) //["sendToCosmos(address,string,uint256)"](WETH_ADDRESS, COSMOS_ADDRESS, numberOfTokens)
    //await gravityContract.sendToCosmos(WETH_ADDRESS, COSMOS_ADDRESS, numberOfTokens)
    console.log(response)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })