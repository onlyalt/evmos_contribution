import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import erc721 from '../abis/erc721.json'
import {NFT_CONTRACT_MAP, RPC_ENDPOINT} from '../constants'
import {loadWallet, verifySignUp} from './helpers'
const { ethers } = require("ethers");


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: localStorage.getItem('address'),
      otterValue: "0.1"
    }
    this.loadWalletAndMintOtter = this.loadWalletAndMintOtter.bind(this)
  }

  async componentDidMount() {
    const encryptedPrivKey = localStorage.getItem('encryptedPrivKey');
  }
  


    async loadWalletAndMintOtter(password, recipient, value){
        try{
            const wallet = loadWallet(password, RPC_ENDPOINT)
            await this.mintOtter(wallet, recipient, value)
        } catch(err){
            alert('Invalid Password')
        }
    }

  async mintOtter(
    wallet,
    recipient,
    value
  ){
    try {
      const erc721Contract = new ethers.Contract(NFT_CONTRACT_MAP.contractAddress, erc721.abi, wallet);
      let response = await erc721Contract.mintOtter(recipient, {value: ethers.utils.parseEther(value)})
      let transactionHash = response.hash;
      alert(`TransactionHash: ${transactionHash}`)
      console.log(transactionHash);
    } catch(err) {
      // catches errors both in fetch and response.json
      console.log(err)
      alert('Impossible to send transaction. Verify that you have already signed up with your Evmos menmonic.')
    }

  }

  render() {
    return (
      <div>
        <img src="https://om-nft.s3.us-east-2.amazonaws.com/otternftbanner.png" id="bannerImage"/>
        <form onSubmit={(event) => {
                event.preventDefault()
                verifySignUp()
                const recipient = this.otterRecipient.value
                const password = prompt("Enter Password to validate Transaction", "");
                this.loadWalletAndMintOtter(password, recipient, this.state.otterValue)
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




