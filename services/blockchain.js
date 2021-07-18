// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const ethers = require('ethers');
const { Keccak } = require('sha3');


const getContract = (config, wallet) => {
    return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const mint721 = async (config, address, hash, ipfsCID) => {
    const provider = new ethers.providers.InfuraProvider(config.network, config.infuraProjectId);
    const wallet = ethers.Wallet.fromMnemonic(config.mnemonic).connect(provider);
    const erc721 = await getContract(config, wallet);

    const id = '0x' + hash;
    
    return erc721.safeMint(address, id, ipfsCID, { gasLimit: 1_000_000 });
};

module.exports = {
    mint721
}