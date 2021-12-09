import {loadAndDecodeEncryptedKey} from './crypto';
const { ethers } = require("ethers");

const loadWallet = (password, rpc) => {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const decryptedPrivateKey = loadAndDecodeEncryptedKey(password);
    const wallet = new ethers.Wallet(decryptedPrivateKey, provider);

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