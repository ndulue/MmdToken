pragma solidity ^0.5.16;
import "./MmdToken.sol";

contract DappTokenSale{
    address admin;
    MmdToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        address _amount
    );

    constructor(MmdToken _tokenContract, uint256 _tokenPrice) public { 
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice
    }

    //multiply
    function multiply(uint x, uint y) internal pure returns(uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    //BuyTokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens))
        tokensSold += _numberOfTokens;

        Sell(msg.sender, _numberOfTokens);
    }

    //Ending the token sale
    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        selfdestruct(admin);
    }
}