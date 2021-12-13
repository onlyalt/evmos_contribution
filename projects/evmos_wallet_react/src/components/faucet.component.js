import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import erc20 from '../abis/erc20.json'
import {ADDRESS_OTT_CONTRACT, RPC_ENDPOINT, FAUCET_MNEMONIC} from '../constants'
const { ethers } = require("ethers");

class App extends Component {

  async componentDidMount() {
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props)
    this.state = {
        walletFaucet: null,
    }
    this.transferErc20Coin = this.transferErc20Coin.bind(this)
  }

  async loadBlockchainData() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const walletMnemonic = ethers.Wallet.fromMnemonic(FAUCET_MNEMONIC, `m/44'/60'/0'/0/0`)
    const walletFaucet = walletMnemonic.connect(provider)
    
    this.setState({ 
      walletFaucet: walletFaucet
    })  
  }

  async transferErc20Coin(
    wallet,
    recipient, 
    tokenAmount){

    const erc20Contract = new ethers.Contract(ADDRESS_OTT_CONTRACT, erc20.abi, wallet);
    let numberOfTokens = ethers.utils.parseUnits(tokenAmount, 18);
    
    const transactionOptions = {
        gasLimit: 6000000,
        gasPrice: ethers.utils.parseUnits('1.0', 'gwei')
    }

    try {
      let response = await erc20Contract.transfer(recipient, numberOfTokens, transactionOptions)
      let transactionHash = response.hash;
      alert(`TransactionHash: ${transactionHash}`)
    } catch(err) {
      // catches errors both in fetch and response.json
      console.log(err)
      alert(err)
    }
  }
  
  render() {
      return (
      <form onSubmit={(event) => {
        event.preventDefault()
        const recipient = this.recipient.value
        console.log(this.state?.walletFaucet)
        this.transferErc20Coin(this.state?.walletFaucet,recipient, "100")
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



