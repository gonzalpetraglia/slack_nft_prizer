require('hardhat-deploy');
const { config }  = require("dotenv");
const { resolve } = require("path");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
config({ path: resolve(__dirname, "./.env") });
console.log(process.env.MNEMONIC)
console.log(process.env.INFURA_PROJECT_ID)
module.exports = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: 0
  },
  defaultNetwork: 'hardhat',
  networks: {
    kovan: {
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      chainId: 42,
      url: "https://kovan.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
    }
  }
};