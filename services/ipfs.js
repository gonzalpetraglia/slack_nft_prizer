const pinata = require('@pinata/sdk');


const pinMetadata = async (config, metadata, name) => {
    const client = pinata(config.key, config.secret);
    const result = await client.pinJSONToIPFS(metadata, { pinataMetadata: { name }});
    return result.IpfsHash;
}

const getImageData = async (config, semester) => {
    const client = pinata(config.key, config.secret);
    const filters = {
        metadata: {
            keyvalues: {
                semester: {
                    value: semester,
                    op: "eq"
                }
            }
        }
    };
    const result = await client.pinList(filters);
    if(result.count !== 1)
        throw new Error('ambigous or non existent result');    
    const imageData = result.rows[0];
    return { hash: imageData.ipfs_pin_hash, url: `ipfs://${imageData.ipfs_pin_hash}`}
};

module.exports = { 
    pinMetadata,
    getImageData
}