//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Prizes is ERC721, Ownable {

    mapping(uint256 => string) public postfix;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable() {
    }

    function safeMint(address to, uint256 tokenId, string memory ipfsCID) public onlyOwner {
        _safeMint(to, tokenId, "");
        postfix[tokenId] = ipfsCID;
    }


    function tokenURI(uint256 tokenId) public override view returns(string memory){
        require(_exists(tokenId), "token not exists");
        return string(abi.encodePacked("ipfs://", postfix[tokenId]));
    }
}
