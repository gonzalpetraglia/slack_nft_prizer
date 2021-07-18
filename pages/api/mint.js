const ethers = require('ethers');

const { mint721 } = require('../../services/blockchain');
const { getImageData, pinMetadata} = require('../../services/ipfs');


const { address: contractAddress, abi: contractAbi} = require(`../../deployments/${process.env.NETWORK}/Prizes.json`)
const config = {
  slack: {
    token: process.env.SLACK_TOKEN,
    teamDomain: process.env.TEAM_DOMAIN,
    authorizedUserIds: process.env.AUTHORIZED_IDS.split(','),
  },
  blockchain: {
    network: process.env.NETWORK,
    mnemonic: process.env.MNEMONIC,
    infuraProjectId: process.env.INFURA_PROJECT_ID,
    contractAddress,
    contractAbi
  },
  ipfs: {
    key: process.env.KEY,
    secret: process.env.SECRET
  }
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
    checkDomain(config.slack.teamDomain, req.body.team_domain);
    checkUser(config.slack.authorizedUserIds, req.body.user_id);
    checkToken(config.slack.token, req.body.token);
    checkCommand('/mint', req.body.command);
    
    const parameters = req.body.text.split(' ');
    
    const imageData = await getImageData(config.ipfs, '1c2021');
    const subject = 'Taller de Programación 2';
    const university = 'FIUBA';
    const address = parameters[0];
    const name = parameters[1];
    const semester = parameters[2];
    const id = parameters[3];
    const amount = parameters[4];
    const metadata = {
      name: parameters[1],
      description: `A prize given in ${university}'s ${subject}. Prize ${id} out of ${amount} of this type`,
      semester,
      image: imageData.url,
      attributes: {
        subject: 'Taller de Programacion 2',
        university: 'FIUBA',
        id,
        amount
      }
    };

    const ipfsHash = await pinMetadata(config.ipfs, metadata, `${name}-${semester}-${id}`);

    const hash = Buffer.from(ethers.utils.base58.decode(ipfsHash)).toString('hex').slice(4);
    
    const tx = await mint721(config.blockchain, address, hash, ipfsHash);

    const message = `Minting a token with data: ${JSON.stringify(metadata)} and hash: ${hash}. \n\n Tx can be seen in: https://${config.blockchain.network}.etherscan.io/tx/${tx.hash}`;
    res.statusCode = 200;
    res.json({ text: message, response_type: 'in_channel' });
  } catch(e) {
    console.log(e);
    res.statusCode = 400;
    res.json({ msg: e });
  }
}
