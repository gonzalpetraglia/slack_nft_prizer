require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');
const { config }  = require("dotenv");
const { resolve } = require("path");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
config({ path: resolve(__dirname, "./.env") });

module.exports = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: 0
  },
  defaultNetwork: 'hardhat',
  networks: {
    rinkeby: {
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      chainId: 4,
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
    }
  }
};