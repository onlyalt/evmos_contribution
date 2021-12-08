import React, { Component } from 'react';
import Web3 from 'web3';

import 'bootstrap/dist/css/bootstrap.css';
import erc20 from '../abis/erc20.json'
import {ADDRESS_OTT_CONTRACT, RPC_ENDOINT} from '../constants'
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
      transactions: [],
      coinToSend: null,
    }
    this.transferErc20Coin = this.transferErc20Coin.bind(this)
    this.transferNativeCoin = this.transferNativeCoin.bind(this)
    this.loadMnemonicFromLocalStorage = this.loadMnemonicFromLocalStorage.bind(this)
  }

  async loadBlockchainData() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
    const mnemonic = this.loadMnemonicFromLocalStorage()
    const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`)

    const wallet = walletMnemonic.connect(provider)
    const ottBalance = await this.getBalanceErc20(wallet, erc20.abi, ADDRESS_OTT_CONTRACT)
    const photonBalance = ethers.utils.formatEther(web3.utils.hexToNumberString((await provider.getBalance(wallet.address))._hex))
    
    this.setState({ 
      wallet: wallet, 
      erc20Abi: erc20.abi,
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
    const numberOfTokens = ethers.utils.parseUnits(tokenAmount, 18);
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
      console.log(transactionHash);
      alert(`TransactionHash: ${transactionHash}`)
    } catch(err) {
      console.log(err)
      alert(err)
    }
  }

  render() {
    if (this.state.coinToSend) {
      return (
      <form onSubmit={(event) => {
        event.preventDefault()
        const recipient = this.recipient.value
        const amount = this.amount.value
        if (this.state.coinToSend === 'photon'){
            this.transferNativeCoin(this.state.wallet, recipient, amount)
        } else {
            this.transferErc20Coin(this.state.wallet,recipient, this.state.erc20Abi, this.state.contractAddressOtt, amount)
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
    } else {
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
                        <h6 style={{ width: "400px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 200}}>{this.state.wallet?.address}</h6>
                    </div>
                    </td>
                    <td>
                        PHOTON
                    </td>
                    <td>
                    {parseFloat(this.state.photonBalance).toFixed(4)}
                    </td>
                    <td><button className="btn btn-primary btn-block" onClick={() => this.setState({coinToSend: 'photon'})}>Send</button></td>
                </tr>
                <tr>
                    <td></td>
                    <td>OTT</td>
                    <td>{parseFloat(this.state.ottBalance).toFixed(4)}</td>
                    <td><button className="btn btn-primary btn-block" onClick={() => this.setState({coinToSend: 'ottcoin'})}>Send</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

export default App;



