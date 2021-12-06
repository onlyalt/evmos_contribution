import React, { Component } from "react";
import {ADDRESS_OTT_CONTRACT, RPC_ENDOINT, MNEMONIC} from '../constants'
const { ethers } = require("ethers");

export default class SignUp extends Component {

    async componentDidMount() {
        const provider = new ethers.providers.JsonRpcProvider(RPC_ENDOINT);
      }

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            mnemonic: '',
            privateKey: '',
            publicKey: '',
            address: ''
        }
        this.retrieveWalletFromMnemonic = this.retrieveWalletFromMnemonic.bind(this)
        this.setStateLocalStorage = this.setStateLocalStorage.bind(this)
    }

    async retrieveWalletFromMnemonic(mnemonic){
        const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
        const subNode = hdNode.derivePath(`m/44'/60'/0'/0/0`);
        const subNodeWallet = new ethers.Wallet(subNode);

        const address = subNodeWallet.address
        const privateKey = subNodeWallet.privateKey
        const publicKey = subNodeWallet.publicKey

        console.log(subNodeWallet.address)
        console.log(subNodeWallet.privateKey)
        console.log(subNodeWallet.publicKey)

        this.setState({ 
            mnemonic: mnemonic,
            privateKey: privateKey,
            publicKey: publicKey,
            address: address
          }, () => {
            console.log(this.state);
            localStorage.setItem('wallet', JSON.stringify(this.state));
            alert(`Address ${address} added to Wallet in localStorage.`)
          }); 
        
    }

    setStateLocalStorage(){
        console.log(this.state)
    }

    getStetLocalStorage(){}

    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                const mnemonic = this.mnemonic.value
                this.retrieveWalletFromMnemonic(mnemonic)
              }}>
                <h3>Import Account</h3>
                <div className="form-group">
                    <label>Mnemonic</label>
                    <input
                      id="mnemonic"
                      type="text"
                      ref={(input) => { this.mnemonic = input }}
                      className="form-control"
                      placeholder="Mnemonic"
                      required />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Import</button>
            </form>
        );
    }
}