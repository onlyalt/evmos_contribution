import React, { Component } from 'react';
import Web3 from 'web3';
import ImageContainer from './containers'

import 'bootstrap/dist/css/bootstrap.css';
import erc721 from '../abis/erc721.json'
import {RPC_ENDOINT,NFT_CONTRACT_MAP} from '../constants'
const { ethers } = require("ethers");

const web3 = new Web3();

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wallet: null,
      erc721abi: null,
      contractAddress: null,
      contractName:null,
      tokenIds:[],
      metadataUrls: [],
      attributes:[],
      imgUrls: [],
      names: [],
      transactions: [],
      otterValue: "0.1",
      idToSend: null
    }
    this.getTokenIds = this.getTokenIds.bind(this)
    this.initializeState = this.initializeState.bind(this)
    this.fetchMetadataFromId = this.fetchMetadataFromId.bind(this)
    this.mintOtter = this.mintOtter.bind(this)
  }

  async componentDidMount() {
    //await this.loadBlockchainData()
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
    const mnemonic = this.loadMnemonicFromLocalStorage()
    const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`)

    const wallet = walletMnemonic.connect(provider)
    await this.initializeState(NFT_CONTRACT_MAP, wallet, erc721.abi)
  }

  async initializeState(contractAddressMap, wallet, contractAbi){
    for (let i = 0, len = contractAddressMap.length; i < len; i++) { 
      const tokenIds = await this.getTokenIds(wallet, contractAddressMap[i].contractAddress, contractAbi);
      this.setState({
        contractAddress: contractAddressMap[i].contractAddress,
        contractName: contractAddressMap[i].contractName,
        tokenIds: tokenIds
      })
    }
    this.setState({wallet: wallet, erc721abi: contractAbi})
    
    for (let i = 0, len = this.state.tokenIds?.length ; i < len; i++) { 
      const metadata = await this.fetchMetadataFromId(wallet, this.state.contractAddress, erc721.abi, this.state.tokenIds[i])
      this.setState({
        names: this.state.names.concat(metadata.name), 
        imgUrls: this.state.imgUrls.concat(metadata.image),
        attributes: this.state.attributes.concat([metadata.attributes])})
    }
    console.log('State Initialized')
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

  async getTokenIds(
    wallet,
    contractAddress,
    contractAbi
  ){
    const erc721Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    const NFTbalance = web3.utils.hexToNumberString((await erc721Contract.balanceOf(wallet.address))._hex);
    const tokenIds = [];
    for (let i = 0, len = NFTbalance ; i < len; i++) { 
        tokenIds.push((await erc721Contract.tokenOfOwnerByIndex(wallet.address, i))._hex);
      }

    return tokenIds
  }

  async fetchMetadataFromId(
    wallet,
    contractAddress,
    contractAbi,
    id){
    try {
      const erc721Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
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



  loadMnemonicFromLocalStorage(){
    var retrievedWallet = localStorage.getItem('wallet');
    var mnemonic = JSON.parse(retrievedWallet).mnemonic
    return mnemonic
}

  async getBalanceErc721(
    wallet,
    contractAbi,
    contractAddress){
      const erc721Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
      const balance = ethers.utils.formatEther((await erc721Contract.balanceOf(wallet.address)).toString());
      return balance
  }

  async transferErc721Coin(
    wallet,
    recipient, 
    contractAbi,
    contractAddress,
    tokenId){

    const erc721Contract = new ethers.Contract(contractAddress, contractAbi, wallet);

    try {
      let response = await erc721Contract["safeTransferFrom(address,address,uint256)"](wallet.address, recipient, web3.utils.hexToNumber(tokenId))
      let transactionHash = response.hash;
      alert(`TransactionHash: ${transactionHash}`)
      console.log(transactionHash);
    } catch(err) {
      // catches errors both in fetch and response.json
      console.log(err)
      alert(err)
    }
  }

  render() {
    if (this.state.idToSend) {
      return (
        <form onSubmit={(event) => {
          event.preventDefault()
          const recipient = this.recipient.value
          this.transferErc721Coin(this.state.wallet, recipient, this.state.erc721abi, this.state.contractAddress, this.state.idToSend)
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

            <span>{this.state.contractName} ({this.state.contractAddress}) </span>
            <p>Address: {this.state.wallet?.address} </p>

            <ImageContainer url={this.state.imgUrls} name={this.state.names} ids={this.state.tokenIds} callbackFn={(id) => this.setState({idToSend: id})}/>

      
          </div>
        );
    }
  }

}

export default App;




