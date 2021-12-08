// contracts/AltErc20.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract erc20 is ERC20 {

    constructor(uint256 _supply) ERC20("Otter Coin", "OTT") {
        _mint(msg.sender, _supply * (10 ** decimals()));
    }
}