import React, { Component } from 'react';
import Web3 from 'web3';

import 'bootstrap/dist/css/bootstrap.css';
import erc20 from '../abis/erc20.json'
import {ADDRESS_OTT_CONTRACT, RPC_ENDOINT, MNEMONIC} from '../constants'
const { ethers } = require("ethers");

const web3 = new Web3();

class App extends Component {

  async componentDidMount() {
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props)
    this.state = {
      wallet: null,
      erc20Abi: null,
      contractAddressOtt : '',
      ottBalance: 0,
      photonBalance: 0,
      transactions: []
    }
  this.transferErc20Coin = this.transferErc20Coin.bind(this)
  this.transferNativeCoin = this.transferNativeCoin.bind(this)
  this.loadMnemonicFromLocalStorage = this.loadMnemonicFromLocalStorage.bind(this)
  }

  async loadBlockchainData() {
    console.log(RPC_ENDOINT)
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
    const mnemonic = this.loadMnemonicFromLocalStorage()
    const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`)

    const wallet = walletMnemonic.connect(provider)
    const ottBalance = await this.getBalanceErc20(wallet, erc20.abi, ADDRESS_OTT_CONTRACT)
    const photonBalance = ethers.utils.formatEther(web3.utils.hexToNumberString((await provider.getBalance(wallet.address))._hex))
    
    this.setState({ 
      wallet: wallet, 
      contractAbi: erc20.abi,
      contractAddressOtt: ADDRESS_OTT_CONTRACT, 
      ottBalance: ottBalance,
      photonBalance: photonBalance,
    }
    )
    
  }

  async getBalanceErc20(
    wallet,
    contractAbi,
    contractAddress){
      const erc20Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
      const balance = ethers.utils.formatEther((await erc20Contract.balanceOf(wallet.address)).toString());

      return balance
  }

  async transferErc20Coin(
    wallet,
    recipient, 
    contractAbi,
    contractAddress,
    tokenAmount){

    const erc20Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    let numberOfTokens = ethers.utils.parseUnits(tokenAmount, 18);

    try {
      let response = await erc20Contract.transfer(recipient, numberOfTokens)
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
  
  async transferNativeCoin(wallet, recipient, amount){
    const tx = {
      to: recipient,
      value: ethers.utils.parseEther(amount)
    }

    try {
      await wallet.signTransaction(tx);
    } catch(err) {
      console.log(err)
      alert(err)
    }

    try {
      let response = await wallet.sendTransaction(tx);
      console.log(response);
      const transactionHash = response.hash;
      console.log(response.from)
      console.log(response.to)
      console.log(ethers.utils.formatEther(web3.utils.hexToNumberString(response.value._hex)))
      console.log(transactionHash);
      alert(`TransactionHash: ${transactionHash}`)
    } catch(err) {
      console.log(err)
      alert(err)
    }
  }


  render() {
    return (
      <div>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style= {{ width: "400px" }}>
            
                <h3>{parseFloat(this.state.photonBalance).toFixed(4)} PHOTON</h3>
                <h3>{parseFloat(this.state.ottBalance).toFixed(4)} OTT</h3>
                
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = this.amount.value
                  this.transferNativeCoin(this.state.wallet, recipient, amount)
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>


                <a
                  className="App-link"
                  href="http://onlyalt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  BUY YOUR NFT <u><b>NOW! </b></u>
                </a>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;




