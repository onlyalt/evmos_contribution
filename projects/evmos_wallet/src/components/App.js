import React, { Component } from 'react';
import logo from '../alt_logo.png';
import './App.css';
import Web3 from 'web3';
import OtterCoin from '../abis/OtterCoin.json'
import { Transaction } from 'ethereumjs-tx';

const PRE_PRIVATE_KEY =  'f5c2c5ad51df662c23be107dfd100fe0166ca7870bd83698b7bb15e769065f93'
const PRIVATE_KEY = '0x' + PRE_PRIVATE_KEY
const OttTokenAddress = "0x5052D35de7697B0aCF2F9F31BE8367c803d88357" 


const provider = new Web3.providers.HttpProvider('http://localhost:8545');
var web3 = new Web3('http://localhost:8545');


class App extends Component {
  async componentWillMount() {
    //await this.loadWeb3()
    await this.loadBlockchainData()
  }
 

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    //const web3 = window.web3
    //console.log(web3)
    //const accounts = await web3.eth.getAccounts()
    //console.log(accounts[0])
    //this.setState({ account: accounts[0] })

    //const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    console.log(web3.version)
    const account_ = await web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    this.setState({fromAddress: account_.address})
    console.log(account_.address)
    this.setState({ accountAddress: account_.address })

    const otterCoin = new web3.eth.Contract(OtterCoin.abi, OttTokenAddress, {from: this.state.account})
    console.log(otterCoin)
    console.log(this.state.accountAddress)
    this.setState({ otterCoin: otterCoin })
    const ottBalance = await otterCoin.methods.balanceOf(this.state.accountAddress).call()
    const photonBalance = await web3.eth.getBalance(this.state.accountAddress)
    this.setState({ ottBalance: web3.utils.fromWei(ottBalance.toString(), 'Ether') })
    this.setState({ photonBalance: web3.utils.fromWei(photonBalance.toString(), 'Ether') })
    //const transactions = await otterCoin.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account} })
    //this.setState({ transactions: transactions })
    //console.log(this.state)
  }
  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      otterCoin: null,
      ottBalance: 0,
      photonBalance: 0,
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
  }

  transfer(recipient, amount){
    // get transaction count, later will used as nonce
    const nonce = web3.eth.getTransactionCount(this.state.accountAddress);
    const rawTx = {
      // this could be provider.addresses[0] if it exists
      //from: this.state.account, 
      // target address, this could be a smart contract address
      to: OttTokenAddress,
      from: this.state.accountAddress,
      // optional if you want to specify the gas limit
      //gasLimit: web3.utils.toHex(250000),
      //gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')), 
      gasPrice: '0x09184e72a000',
      gasLimit: '0x2710',
      //gas: web3.utils.toHex(21000), 
      // optional if you are invoking say a payable function 
      value: "0x0",
      nonce: web3.utils.toHex(nonce),
      // this encodes the ABI of the method and the arguements
      data: this.state.otterCoin.methods.transfer(recipient, web3.utils.toHex(amount)).encodeABI() 
    };
    console.log(rawTx)

    web3.eth.accounts.signTransaction(rawTx, PRIVATE_KEY).then((signed) => {
      web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log);
    });




    //web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

    //web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);

    //.on('receipt', console.log);

    //this.state.otterCoin.methods.transfer(recipient, amount).send({ from: this.state.account})
  }

  //var password = prompt('Enter password for encryption', 'password')

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alt Wallet
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style= {{ width: "400px" }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} width="150" className="App-logo" alt="logo" />
                </a>
                <h3>{this.state.photonBalance} PHOTON</h3>
                <h3>{this.state.ottBalance} OTT</h3>
                
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = web3.utils.toWei(this.amount.value, "Ether")
                  this.transfer(recipient, amount)

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

                <div>
                  <script src="lightwallet.min.js"></script>
               </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
