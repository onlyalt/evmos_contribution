// contracts/AltErc20.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OtterCoin is ERC20 {

    constructor(uint256 _supply) ERC20("Otter Coin", "OTT") {
        _mint("0xF1F511428a873b8D448b37133B776e62e24bFbFE", _supply * (10 ** decimals()));
    }
}