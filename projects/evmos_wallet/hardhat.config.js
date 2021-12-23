require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = process.env.KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "evmos_local",
  networks: {
    hardhat: {
      from: '0xdd2fd4581271e230360230f9337d5c0430bf44c0',
    },
    ethereum: {
      url: "https://main-light.eth.linkpool.io/",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 80000000
    },
    evmos_local: {
      url: "http://localhost:8545",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 80000000
    },
    goerli:{
      url: "https://goerli-light.eth.linkpool.io/",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 30000000000
    },
    rinkeby:{
      url: "https://rinkeby-light.eth.linkpool.io/",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 50000000000
    },
    matic: {
      url: "https://matic-mainnet.chainstacklabs.com",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 50000000000
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 50000000000
    },
    bnc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [PRIVATE_KEY],
    },
    klay: {
      url: "https://api.cypress.ozys.net:8651",
      accounts: [PRIVATE_KEY],
    },
    baobab: {
      url: "https://api.baobab.klaytn.net:8651",
      accounts: [PRIVATE_KEY],
    },
    evmos: {
      url: "http://arsiamons.rpc.evmos.org:8545",
      accounts: [PRIVATE_KEY],
    }

  },
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
}