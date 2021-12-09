import {loadAndDecodeEncryptedKey} from './crypto';
const { ethers } = require("ethers");

const loadWallet = (password, rpc) => {
    const decryptedPrivateKey = loadAndDecodeEncryptedKey(password);
    const wallet = new ethers.Wallet(decryptedPrivateKey, rpc);

    return wallet
  }

  const verifySignUp = () => {
    const encryptedPrivKey = localStorage.getItem('encryptedPrivKey');
    if (encryptedPrivKey === null){
        alert('You need to signup before being able to transaction.\n Input your Evmos mnemonic on SingUp page')
    }
  }

export {
    loadWallet,
    verifySignUp
}