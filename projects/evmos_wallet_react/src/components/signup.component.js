import React, { Component } from "react";
const { ethers } = require("ethers");

export default class SignUp extends Component {

    async componentDidMount() {
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
    }

    async retrieveWalletFromMnemonic(mnemonic){
        const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
        const subNode = hdNode.derivePath(`m/44'/60'/0'/0/0`);
        const subNodeWallet = new ethers.Wallet(subNode);

        const address = subNodeWallet.address
        const privateKey = subNodeWallet.privateKey
        const publicKey = subNodeWallet.publicKey

        this.setState({ 
            mnemonic: mnemonic,
            privateKey: privateKey,
            publicKey: publicKey,
            address: address
          }, () => {
            localStorage.setItem('wallet', JSON.stringify(this.state));
            alert(`Address ${address} added to Wallet in localStorage.`)
          }); 
        
    }

    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                const mnemonic = this.mnemonic.value
                this.retrieveWalletFromMnemonic(mnemonic)
              }}>
                <h3 style={{
                    marginBottom: '12px',
                }}>Import Account</h3>
                <div className="form-group">
                    <label style={{
                        marginBottom: '12px',
                    }}>Mnemonic</label>
                    <input
                      id="mnemonic"
                      style={{
                        marginBottom: '12px',
                      }}
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