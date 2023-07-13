// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0 ;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool res);
}

contract ZK_Punk is ERC721 {
    uint256 public latestToken = 1;
    address public verifier;
    mapping(address => bool) public nullifiermap;
    uint256 public secretHash = 15816790041894035629812969348918251598434796263086720583354417805817603431710;
    string public baseurl = "ipfs://QmPZgwximvEGeM5RNUjw1RWRNvzKRhDdRdAqRb4PjUBS1J";

    constructor(address _verifier) ERC721("ZK_Punks", "ZKP") {
        verifier = _verifier;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return baseurl;
    }

    function mint(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) public {
        require(IVerifier(verifier).verifyProof(a,b,c,[input[0], uint(uint160(address(msg.sender))), secretHash]), "Proof is not valid");
        require(latestToken <= 300, "All tokens are minted!");
        require(!nullifiermap[msg.sender], "Already minted with this proof1");
        _mint(msg.sender, latestToken);
        nullifiermap[msg.sender] = true;
        latestToken++;
    }
}