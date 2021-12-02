//import React, { Component } from 'react';
import logo from '../alt_logo.png';
import './App.css';
import { ethers, Wallet } from 'ethers'
import OtterCoin from '../abis/OtterCoin.json'

var Tx = require('ethereumjs-tx').Transaction;

const PRE_PRIVATE_KEY =  'f5c2c5ad51df662c23be107dfd100fe0166ca7870bd83698b7bb15e769065f93'
const PRIVATE_KEY = '0x' + PRE_PRIVATE_KEY

const OttTokenAddress = "0x5052D35de7697B0aCF2F9F31BE8367c803d88357" 

// connect to the simple provider
let provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')

console.log(provider)