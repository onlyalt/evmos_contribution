const CryptoJS = require("crypto-js");

const generateEncryptionKey = (password) => {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    return [CryptoJS.PBKDF2(password, salt, { keySize: 512/32, iterations: 1000 }), salt]     
}

const retrieveEncryptionKey = (password, salt) => {
    return CryptoJS.PBKDF2(password, salt, { keySize: 512/32, iterations: 1000 })
}

const encodeUserPrivateKey = (privKey, encryptionKey) => {
    const iv  = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(privKey, encryptionKey, {iv: iv }).toString();
    return [encrypted, iv]
}

const decodeUserPrivateKey = (encrypted, encryptionKey, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey, {iv: iv });
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)

    return decryptedString
}

const createEncryptedStateKey = (privKey, password) => {
    const [encryptionKey, salt] = generateEncryptionKey(password)
    const [encryptedPrivKey, iv] = encodeUserPrivateKey(privKey, encryptionKey)
    return [encryptedPrivKey, salt, iv]
}

const loadAndDecodeEncryptedKey = (password) => {
    const encryptedPrivKey = localStorage.getItem('encryptedPrivKey');
    const salt = JSON.parse(localStorage.getItem('salt'));
    const iv = JSON.parse(localStorage.getItem('iv'));

    const encryptionKey = retrieveEncryptionKey(password, salt)
    const decryptedPrivKey = decodeUserPrivateKey(encryptedPrivKey, encryptionKey, iv)

    return decryptedPrivKey     
  }

export {
    retrieveEncryptionKey,
    decodeUserPrivateKey,
    createEncryptedStateKey,
    loadAndDecodeEncryptedKey
};