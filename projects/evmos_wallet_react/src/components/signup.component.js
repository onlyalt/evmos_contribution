import { useHistory } from 'react-router-dom';
import React, { Component } from "react";
import { createEncryptedStateKey } from './crypto';
const { ethers } = require("ethers");


export default class SignUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
          importMethod: null
        }
      }

    getPubPrivKeyFromMnemonic(mnemonic){
        try{
            const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
            const subNode = hdNode.derivePath(`m/44'/60'/0'/0/0`);
            const subNodeWallet = new ethers.Wallet(subNode);

            const unencryptedState = {
                address: subNodeWallet.address,
                privateKey: subNodeWallet.privateKey,
                publicKey: subNodeWallet.publicKey
            }
            return unencryptedState
        } catch(err){
            alert('Impossible to load wallet. Make sure you entered a valid BIP-39 mnemonic.')
        }
    }

    getPubPrivKeyFromPrivKey(privateKey){
        const wallet = new ethers.Wallet(privateKey);
        const unencryptedState = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey
        }

        return unencryptedState
    }

    encryptAndStore(input, password, importMethod){
        if (importMethod === 'Evmos Mnemonic'){
            var unencryptedState = this.getPubPrivKeyFromMnemonic(input)
        } else if (importMethod === 'ETH Private Key') {
            var unencryptedState = this.getPubPrivKeyFromPrivKey(input)
        }
        
        const [encryptedPrivKey, salt, iv] = createEncryptedStateKey(unencryptedState.privateKey, password)

        localStorage.setItem('salt', JSON.stringify(salt));
        localStorage.setItem('iv', JSON.stringify(iv));
        localStorage.setItem('encryptedPrivKey', encryptedPrivKey);
        localStorage.setItem('address', unencryptedState.address);

        alert(`\nPrivate Key salted and encrypted in localStorage on client side. Nothing is exported on our servers.\n\nYou will need your password to perform transactions.\n\nAdress added: ${unencryptedState.address}.`)
        
    }

    render() {
        if (this.state.importMethod) {
            return (
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const input = this.input.value
                    const password1 = this.password1.value
                    const password2 = this.password2.value
                    if (password1 === password2) {
                        this.encryptAndStore(input, password1, this.state.importMethod)
                    } else {
                        alert('Passwords are not matching')
                    }
                    
                  }}>
                    <h3 style={{
                        marginBottom: '12px',
                    }}>Import {this.state.importMethod}</h3>
                    <div className="form-group">
                        <label style={{
                            marginBottom: '12px',
                        }}>{this.state.importMethod}</label>
                        <input
                          id="mnemonic"
                          style={{
                            marginBottom: '12px',
                          }}
                          type="password"
                          ref={(input) => { this.input = input }}
                          className="form-control"
                          placeholder={this.state.importMethod}
                          required />
                        <label style={{
                            marginBottom: '12px',
                        }}>Password</label>
                        <input
                          id="password"
                          style={{
                            marginBottom: '12px',
                          }}
                          type="password"
                          ref={(input) => { this.password1 = input }}
                          className="form-control"
                          placeholder="Choose a Password for your account"
                          required />
                        <input
                          id="password"
                          style={{
                            marginBottom: '12px',
                          }}
                          type="password"
                          ref={(input) => { this.password2 = input }}
                          className="form-control"
                          placeholder="Repeat Password"
                          required />
                    </div>
    
                    <button type="submit" className="btn btn-primary btn-block" style={{marginBottom: '12px', marginRight: '12px'}}>Import</button>
                    <button type="submit" className="btn btn-secondary btn-block" style={{marginBottom: '12px'}} onClick={() => this.setState({importMethod: null})}>Cancel</button>
                </form>
            );
        } else {
            return(
                <div>
                    
                
                    <div>
                        <h3 style={{
                            marginBottom: '12px',
                        }}>Import Account</h3>
                        <button type="submit" className="btn btn-primary btn-block" style={{
                marginBottom: '50px',
                marginLeft: '70px',
                marginRight: '12px',
                }} onClick={() => this.setState({importMethod: 'Evmos Mnemonic'})}>Import Evmos Mnemonic</button>
                <button type="submit" className="btn btn-primary btn-block" style={{
                marginBottom: '50px',
                }} onClick={() => this.setState({importMethod: 'ETH Private Key'})}>Import ETH Private Key</button>
                    </div>
                    <div>
                        <ol>
                            <li> <b>Import Evmos Mnemonic:</b> If you created your wallet through <code>evmosd keys add</code> command</li>
                            <li> <b>Import ETH Private Key:</b> You can retrieve it through Metamask or using <code>evmosd keys unsafe-export-eth-key</code> command</li>
                        </ol>
                    </div>
                
                </div>
            )
        }
        
    }
}