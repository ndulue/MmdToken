const MmdToken = artifacts.require("./MmdToken.sol");
const MmdTokenSale = artifacts.require("./MmdTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(MmdToken, 1000000).then(function() {
    var tokenPrice = 1000000000000000;
    return deployer.deploy(MmdTokenSale, MmdToken.address, tokenPrice);
  });
  
};
