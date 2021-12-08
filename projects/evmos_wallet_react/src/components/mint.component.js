import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import erc721 from '../abis/erc721.json'
import {RPC_ENDOINT} from '../constants'
const { ethers } = require("ethers");


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wallet: null,
      erc721abi: null,
      contractAddress: null,
      otterValue: "0.1"
    }
    this.initializeState = this.initializeState.bind(this)
    this.mintOtter = this.mintOtter.bind(this)
  }

  async componentDidMount() {
    //await this.loadBlockchainData()
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
    const mnemonic = this.loadMnemonicFromLocalStorage()
    const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`)
    const wallet = walletMnemonic.connect(provider)
    this.setState({wallet: wallet, erc721abi: erc721.abi})
  }

  async mintOtter(
    wallet,
    contractAddress,
    contractAbi,
    recipient,
    value
  ){
    const erc721Contract = new ethers.Contract(contractAddress, contractAbi, wallet);

    try {
      let response = await erc721Contract.mintOtter(recipient, {value: ethers.utils.parseEther(value)})
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
      <div>
        <img src="https://om-nft.s3.us-east-2.amazonaws.com/otternftbanner.png" id="bannerImage"/>
        <form onSubmit={(event) => {
                event.preventDefault()
                const recipient = this.otterRecipient.value
                this.mintOtter(this.state.wallet, this.state.contractAddress, this.state.erc721abi, recipient, this.state.otterValue)
              }}>
                <div className="form-group">
                    <label style={{
                        marginBottom: '6px',
                    }}>Price: {this.state.otterValue} PHOTONS</label>
                    <input
                      id="address"
                      style={{
                        marginBottom: '6px',
                      }}
                      type="text"
                      ref={(input) => { this.otterRecipient = input }}
                      className="form-control"
                      placeholder="Address"
                      required />
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{marginBottom: '12px',display:"inline-block"}}>Mint</button>
          </form>

  
      </div>
    );
}
}

export default App;




