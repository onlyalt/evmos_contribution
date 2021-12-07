const Factory = artifacts.require("OtterswapV2Factory.sol");
const WPHOTON = artifacts.require("WPHOTON.sol");

module.exports = async function (deployer, _network, addresses) {
  await deployer.deploy(WPHOTON);
  // OTT Contact
  ott_contract = WPHOTON.address;
  console.log(ott_contract);
};
