const { assert } = require("chai");

var MmdTokenSale = artifacts.require('./MmdTokenSale.sol');
var MmdToken = artifacts.require('./MmdToken.sol');

contract('MmdToken', function(accounts) {
    var buyer = accounts[1];
    var admin = accounts[0];
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000;
    var tokensAvailable = 750000;
    var numberOfTokens;

    it('initializes the contract with the contract with the correct values', function() {
        return MmdTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct')
        })
    });  
    
    it('buys token', function(){
        return MmdToken.deployed().then(function(instance){            
            //Grab token instance first
            tokenInstance = instance;
            return MmdToken.deployed();
        }).then(function(instance){   
            //Then grab token sale instance         
            tokenSaleInstance = instance;
            //Provisional 75% of all token to token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin})
        }).then(function(receipt){
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger the event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increment the tokens');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);

            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1 });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        });
    });

    it('ends token sale', function(){
        return MmdToken.deployed().then(function(instance){
            tokenInstance = instance;
            return MmdTokenSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;

            return tokenSaleInstance.endSale({ from: buyer });
        }).then(assert.fail).catch(function(error){
            assert.error.message.indexOf('revert' >= 0, 'must be admin to end sale');
            
            return tokenSaleInstance.endSale({ from: admin });
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 999990, 'return all unsold token to admin');

            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price.toNumber(), 0, 'token price was reset');
        })
    })
});