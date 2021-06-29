//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Prizes is ERC721, Ownable {

    string private baseURI;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(){
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId, "");
    }


    function _baseURI() internal view override returns(string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
}
