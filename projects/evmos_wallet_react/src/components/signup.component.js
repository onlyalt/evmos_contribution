import React, { Component } from "react";
import { createEncryptedStateKey } from './crypto';
const { ethers } = require("ethers");


export default class SignUp extends Component {

    async componentDidMount() {
        /*const privKey = 'privKey'
        const password = 'password'
        const [encryptedPrivKey, salt, iv] = this.createEncryptedStateKey(privKey, password)
        console.log('encrypted priv key')
        console.log(encryptedPrivKey)
        const retrievedEncryptionKey = this.retrieveEncryptionKey(password, salt)
        console.log('retrieved encryptio')
        console.log(retrievedEncryptionKey)
        const decrypted = this.decodeUserPrivateKey(encryptedPrivKey, retrievedEncryptionKey, iv)
        console.log('decrypted')
        console.log(decrypted)

        console.log(iv)
        localStorage.setItem('iv', JSON.stringify(iv));
        const afteriv = JSON.parse(localStorage.getItem('iv'));
        console.log(afteriv)

        console.log(salt)
        localStorage.setItem('salt', JSON.stringify(salt));
        const aftersalt = JSON.parse(localStorage.getItem('salt'));
        console.log(aftersalt)

        console.log(encryptedPrivKey)
        localStorage.setItem('encryptedPrivKey', encryptedPrivKey);
        const afterencryptedPrivKey = localStorage.getItem('encryptedPrivKey');
        console.log(afterencryptedPrivKey)

        const decryptedBIS = this.decodeUserPrivateKey(afterencryptedPrivKey, retrievedEncryptionKey, afteriv)
        console.log(decryptedBIS)*/
        
      }

    constructor(props) {
        super(props)
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

    encryptAndStoreFromMnemonic(mnemonic, password){
        const unencryptedState = this.getPubPrivKeyFromMnemonic(mnemonic)
        const [encryptedPrivKey, salt, iv] = createEncryptedStateKey(unencryptedState.privateKey, password)

        localStorage.setItem('salt', JSON.stringify(salt));
        localStorage.setItem('iv', JSON.stringify(iv));
        localStorage.setItem('encryptedPrivKey', encryptedPrivKey);
        localStorage.setItem('address', unencryptedState.address);

        alert(`\nPrivate Key salted and encrypted in localStorage on client side. Nothing is exported on our servers.\n\nYou will need your password to perform transactions.\n\nAdress added: ${unencryptedState.address}.`)
        
    }

    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                const mnemonic = this.mnemonic.value
                const password1 = this.password1.value
                const password2 = this.password2.value
                if (password1 === password2) {
                    this.encryptAndStoreFromMnemonic(mnemonic, password1)
                } else {
                    alert('Passwords are not matching')
                }
                
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
                      type="password"
                      ref={(input) => { this.mnemonic = input }}
                      className="form-control"
                      placeholder="Import your Evmos Mnemonic"
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

                <button type="submit" className="btn btn-primary btn-block">Import</button>
            </form>
        );
    }
}