// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const ethers = require('ethers');
const { Keccak } = require('sha3');
const axios = require('axios');

const config = {
  network: process.env.NETWORK,
  mnemonic: process.env.MNEMONIC,
  infuraProjectId: process.env.INFURA_PROJECT_ID,
  slackToken: process.env.SLACK_TOKEN,
  teamDomain: process.env.TEAM_DOMAIN,
  authorizedUserIds: process.env.AUTHORIZED_IDS.split(',')
};

const { address: contractAddress, abi: contractAbi} = require(`../../deployments/${config.network}/Prizes.json`)

const getContract = (config, wallet) => {
  return new ethers.Contract(contractAddress, contractAbi, wallet);
};
const checkUser = (authorizedUserIds, actualUserId) => {
  if(!authorizedUserIds.includes(actualUserId))
    throw "user not autorized";
};

const checkDomain = (expectedDomain, actualDomain) => {
  if(expectedDomain !== actualDomain)
    throw "not expected domain";
};

const checkToken = (expectedToken, actualToken) => {
  if(expectedToken !== actualToken)
    throw "not valid token";
};

const checkCommand = (expectedCommand, actualCommand) => {
  if(expectedCommand !== actualCommand)
    throw "not valid command";
};

export default async (req, res) => {
  try {
    checkDomain(config.teamDomain, req.body.team_domain);
    checkUser(config.authorizedUserIds, req.body.user_id);
    checkToken(config.slackToken, req.body.token);
    checkCommand('/mint', req.body.command);

    const provider = new ethers.providers.InfuraProvider(config.network, config.infuraProjectId);
    const wallet = ethers.Wallet.fromMnemonic(config.mnemonic).connect(provider);
    const erc721 = await getContract(config, wallet);
    const parameters = req.body.text.split(' ');

    const hashAlgorithm = new Keccak(256);
    const address = parameters[0];

    const metadata = {
      prizeName: parameters[1],
      semester: parameters[2],
      id: parameters[3],
      amount: parameters[4],
      subject: 'Taller de Programacion 2',
      university: 'FIUBA'
    };
    const metadataString = JSON.stringify(metadata);
    hashAlgorithm.update(metadataString);
    const id = '0x' + hashAlgorithm.digest().toString('hex');

    const tx = await erc721.safeMint(address, id, { gasLimit: 100_000 });
    const message = `Minting a token with data: ${metadataString}. \n\n Tx can be seen in: https://${config.network}.etherscan.io/tx/${tx.hash}`;
    res.statusCode = 200;
    res.json({ text: message, response_type: 'in_channel' });
  } catch(e) {
    console.log(e);
    res.statusCode = 400;
    res.json({ msg: e });
  }
}
