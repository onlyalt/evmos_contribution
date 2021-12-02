import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

import { resolve } from "path";
// import { config as dotenvConfig } from "dotenv";


// dotenvConfig({path: resolve(__dirname, "./.env")});

const config: HardhatUserConfig = {
  defaultNetwork: "olympus_mons",
  networks: {
    olympus_mons: {
      url: "http://localhost:8545",
      accounts: {
        count: 10,
        mnemonic: "ADD_TESTNET_MNEMONIC",
        path: "m/44'/60'/0'/0",
      },
      gasPrice: 5e10
    },
    localnet: {
      url: "http://localhost:8555",
      accounts: {
        count: 10,
        mnemonic: "ADD_LOCAL_MNEMONIC",
        path: "m/44'/60'/0'/0",
      },
      gasPrice: 5e10
    }
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test"
  },
  solidity: {
    version: "0.8.9",
    settings: {
      metadata: {
        bytecodeHash: "none"
      },
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5"
  }
}

export default config;
