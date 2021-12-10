import React, { Component } from 'react';
import Web3 from 'web3';
import ImageContainer from './containers'

import 'bootstrap/dist/css/bootstrap.css';
import erc721 from '../abis/erc721.json'
import {loadWallet} from './helpers'
import {RPC_ENDPOINT,NFT_CONTRACT_MAP} from '../constants'
const { ethers } = require("ethers");
const web3 = new Web3();

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: localStorage.getItem('address'),
      tokenIds:[],
      metadataUrls: [],
      imgUrls: [],
      names: [],
      transactions: [],
      otterValue: "0.1",
      idToSend: null
    }
    this.loadWalletAndTransferErc721Coin = this.loadWalletAndTransferErc721Coin.bind(this)
  }

  async componentDidMount() {
    if (this.state.address === null){
      alert('You need to sign up first')
    } else{
      await this.loadBlockchainData()
    }
    
  }

  async loadBlockchainData() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    await this.initializeState(provider)
  }

  async initializeState(provider){
    const tokenIds = await this.getTokenIds(provider);
    this.setState({tokenIds: tokenIds})
    
    for (let i = 0, len = tokenIds.length ; i < len; i++) { 
      const metadata = await this.fetchMetadataFromId(provider, tokenIds[i])
      this.setState({
        names: this.state.names.concat(metadata.name), 
        imgUrls: this.state.imgUrls.concat(metadata.image)
      })
    }
  }

  async getTokenIds(provider){
    const erc721Contract = new ethers.Contract(NFT_CONTRACT_MAP.contractAddress, erc721.abi, provider);
    const NFTbalance = web3.utils.hexToNumberString((await erc721Contract.balanceOf(this.state.address))._hex);
    const tokenIds = [];
    for (let i = 0, len = NFTbalance ; i < len; i++) { 
        tokenIds.push((await erc721Contract.tokenOfOwnerByIndex(this.state.address, i))._hex);
      }
    return tokenIds
  }

  async fetchMetadataFromId(
    provider,
    id){
    try {
      const erc721Contract = new ethers.Contract(NFT_CONTRACT_MAP.contractAddress, erc721.abi, provider);
      const metadataLink = await erc721Contract.tokenURI(id);
      this.setState({metadataUrls: this.state.metadataUrls.concat(metadataLink)})
      const response = await fetch(metadataLink);
      const responseJson = await response.json();
      return responseJson
    } catch(error) {
      console.error(error);
      alert(error)
    }
  }


  async loadWalletAndTransferErc721Coin(
    password,
    recipient, 
    tokenId){
    try{
      const wallet = loadWallet(password, RPC_ENDPOINT)
      const erc721Contract = new ethers.Contract(NFT_CONTRACT_MAP.contractAddress, erc721.abi, wallet);

      try {
        let response = await erc721Contract["safeTransferFrom(address,address,uint256)"](wallet.address, recipient, web3.utils.hexToNumber(tokenId))
        let transactionHash = response.hash;
        alert(`TransactionHash: ${transactionHash}`)
      } catch(err) {
        // catches errors both in fetch and response.json
        console.log(err)
        alert(err)
      }
    } catch(err){
      console.log(err)
      alert('Invalid Password')
    }
  }

  render() {

    if (this.state.address === null){
      return(
        <div>
          <h6>You need to sign up first</h6>
        </div>

      )
    } else {

      if (this.state.idToSend) {
        return (
          <form onSubmit={(event) => {
            event.preventDefault()
            const recipient = this.recipient.value
            const password = prompt("Enter Password to validate Transaction", "");
            this.loadWalletAndTransferErc721Coin(password, recipient, this.state.idToSend)
          }}>
            <h3>Sending Otter #{web3.utils.hexToNumber(this.state.idToSend)}</h3>
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
            }}>Send</button>
            <button type="submit" className="btn btn-secondary btn-block" style={{
              marginBottom: '12px',
            }} onClick={() => this.setState({idToSend: null})}>Cancel</button>
          </form>);
      } else {
          return (
            <div>
              <h3 style={{
                marginBottom: '12px',
            }}>NFT Wallet </h3>

              <span>{NFT_CONTRACT_MAP.contractName} ({NFT_CONTRACT_MAP.contractAddress}) </span>
              <p>Address: {this.state.address} </p>

              <ImageContainer url={this.state.imgUrls} name={this.state.names} ids={this.state.tokenIds} callbackFn={(id) => this.setState({idToSend: id})}/>

        
            </div>
          );
      }
  }
  }
}

export default App;




