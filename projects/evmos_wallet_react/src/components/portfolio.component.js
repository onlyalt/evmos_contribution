import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import erc20 from '../abis/erc20.json'
import {ADDRESS_OTT_CONTRACT, RPC_ENDPOINT} from '../constants'
import {loadWallet} from './helpers'
import Web3 from 'web3';
const { ethers } = require("ethers");

const web3 = new Web3();

class App extends Component {

  async componentDidMount() {
    if (this.state.address === null){
      alert('You need to sign up first')
    } else{
      await this.getBalance()
    }
    
  }

  constructor(props) {
    super(props)
    this.state = {
      address: localStorage.getItem('address'),
      ottBalance: 0,
      photonBalance: 0,
      transactions: [],
      coinToSend: null,
    }
    this.loadWalletAndSendErc20 = this.loadWalletAndSendErc20.bind(this)
    this.loadWalletAndSendErc20 = this.loadWalletAndSendErc20.bind(this)
    this.getBalance = this.getBalance.bind(this)
  }

  async getBalance() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const ottBalance = await this.getBalanceErc20(provider, this.state.address, erc20.abi, ADDRESS_OTT_CONTRACT)
    const photonBalance = ethers.utils.formatEther(web3.utils.hexToNumberString((await provider.getBalance(this.state.address))._hex))
    this.setState({ottBalance: ottBalance, photonBalance: photonBalance})
  }


  loadWalletAndSendErc20(password, recipient, amount){
    try{
      const wallet = loadWallet(password, RPC_ENDPOINT)
      this.transferErc20Coin(
        wallet,
        recipient, 
        erc20.abi,
        ADDRESS_OTT_CONTRACT,
        amount)
      } catch(err){
        console.log(err)
        alert('Invalid password')
      }
    }

  loadWalletAndSendNativeCoin(password, recipient, amount){
    try{
      const wallet = loadWallet(password, RPC_ENDPOINT)
      this.transferNativeCoin(wallet, recipient, amount)
    } catch(err){
      console.log(err)
      alert('Invalid password')
    }
    
  }

  async getBalanceErc20(
    provider,
    address,
    contractAbi,
    contractAddress){
      const erc20Contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const balance = ethers.utils.formatEther((await erc20Contract.balanceOf(address)).toString());
      return balance
  }

  async transferErc20Coin(
    wallet,
    recipient, 
    contractAbi,
    contractAddress,
    tokenAmount){

    const erc20Contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    const numberOfTokens = ethers.utils.parseUnits(tokenAmount, 18);
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

  
  async transferNativeCoin(wallet, recipient, amount){
    const tx = {
        to: recipient,
        value: ethers.utils.parseEther(amount),
        gasLimit: 6000000,
        gasPrice: ethers.utils.parseUnits('1.0', 'gwei')
    }

    try {
      await wallet.signTransaction(tx);
    } catch(err) {
      console.log(err)
      alert(err)
    }

    try {
      const response = await wallet.sendTransaction(tx);
      const transactionHash = response.hash;
      alert(`TransactionHash: ${transactionHash}`)
    } catch(err) {
      console.log(err)
      alert(err)
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

      if (this.state.coinToSend) {
        return (
        <form onSubmit={(event) => {
          event.preventDefault()
          const recipient = this.recipient.value
          const amount = this.amount.value
          const password = prompt("Enter Password to validate Transaction", "");
          //this.verifyPassword()
          if (this.state.coinToSend === 'PHOTON'){
              this.loadWalletAndSendNativeCoin(password, recipient, amount)
          } else if (this.state.coinToSend === 'OTT'){
              this.loadWalletAndSendErc20(password, recipient, amount)
          }
        }}>
          <h3>Sending {this.state.coinToSend}</h3>
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
          <div className="form-group mr-sm-2" style={{
            marginBottom: '12px',
          }}>
            <input
              id="amount"
              type="text"
              ref={(input) => { this.amount = input }}
              className="form-control"
              placeholder="Amount"
              required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{
            marginBottom: '12px',
            marginRight: '12px',
          }}>Send</button>
           <button type="submit" className="btn btn-secondary btn-block" style={{
            marginBottom: '12px',
          }} onClick={() => this.setState({coinToSend: null})}>Cancel</button>
        </form>);
      } 
      
      else {
        return (
          <div>
            <div className="content mr-auto ml-auto" style={{ width: "500px"}}>
              <table style={{marginBottom: '12px'}}>
                <thead>
                  <tr>
                    <th style={{width: "200px"}}>Wallet Address</th>
                    <th style={{width: "200px"}}>Token</th>
                    <th style={{width: "200px"}}>Balance</th>
                    <th style={{width: "200px"}}>Send</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                      <td>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <h6 style={{ width: "400px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 200}}>{this.state.address}</h6>
                      </div>
                      </td>
                      <td>PHOTON</td>
                      <td>
                      {parseFloat(this.state.photonBalance).toFixed(4)}
                      </td>
                      <td><button className="btn btn-primary btn-block" onClick={() => this.setState({coinToSend: 'PHOTON'})}>Send</button></td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>OTT</td>
                      <td>{parseFloat(this.state.ottBalance).toFixed(4)}</td>
                      <td><button className="btn btn-primary btn-block" onClick={() => this.setState({coinToSend: 'OTT'})}>Send</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }






    } 
    
 
  }
}

export default App;



