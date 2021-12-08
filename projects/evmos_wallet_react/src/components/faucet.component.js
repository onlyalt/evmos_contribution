import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import erc20 from '../abis/erc20.json'
import {ADDRESS_OTT_CONTRACT, RPC_ENDOINT, FAUCET_MNEMONIC} from '../constants'
const { ethers } = require("ethers");

class App extends Component {

  async componentDidMount() {
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props)
    this.state = {
        walletFaucet: null,
        erc20Abi: null,
        contractAddressOtt : '',
    }
    this.transferErc20Coin = this.transferErc20Coin.bind(this)
  }

  async loadBlockchainData() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
    const walletMnemonic = ethers.Wallet.fromMnemonic(FAUCET_MNEMONIC, `m/44'/60'/0'/0/0`)

    const walletFaucet = walletMnemonic.connect(provider)
    
    this.setState({ 
      walletFaucet: walletFaucet, 
      erc20Abi: erc20.abi,
      contractAddressOtt: ADDRESS_OTT_CONTRACT, 
    })  
  }

  async transferErc20Coin(
    wallet,
    recipient, 
    contractAbi,
    contractAddress,
    tokenAmount){

    const erc20Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    let numberOfTokens = ethers.utils.parseUnits(tokenAmount, 18);
    
    const transactionOptions = {
        gasLimit: 6000000,
        gasPrice: ethers.utils.parseUnits('1.0', 'gwei')
    }

    try {
      let response = await erc20Contract.transfer(recipient, numberOfTokens, transactionOptions)
      let transactionHash = response.hash;
      alert(`TransactionHash: ${transactionHash}`)
      console.log(transactionHash);
    } catch(err) {
      // catches errors both in fetch and response.json
      console.log(err)
      alert(err)
    }
  }

  loadMnemonicFromLocalStorage(){
        var retrievedWallet = localStorage.getItem('wallet');
        var mnemonic = JSON.parse(retrievedWallet).mnemonic
        return mnemonic
  }
  
  render() {
      return (
      <form onSubmit={(event) => {
        event.preventDefault()
        const recipient = this.recipient.value
        this.transferErc20Coin(this.state?.walletFaucet,recipient, this.state?.erc20Abi, this.state?.contractAddressOtt, "100")
      }}>
        <h3>OTT Faucet </h3>
        <div className="form-group mr-sm-2" style={{
          marginBottom: '12px',
        }}>
          <input
            id="recipient"
            type="text"
            ref={(input) => { this.recipient = input }}
            className="form-control"
            placeholder="Recipient Address"
            required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" style={{
          marginBottom: '12px',
          marginRight: '12px',
        }}>Claim OTT</button>
      </form>);
    } 
}

export default App;



