pragma solidity ^0.5.16;

contract MmdToken {

    string public name = "Mmd Token";
    string public symbol = "MMDT";
    string public standard = "Mmd Token v1.0";
    uint public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;


    //Constructor
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initailSupply;
    }

    //Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        //exception if account doesnt have enough
        require(balanceOf[msg.sender] >= _value);
        //Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value);

        return true;
    }

    //Approve
    function approve(address _spender, uint256 _value) public returns (bool success) {
        //allowance
        allowance[msg.sender][_spender] =  _value;

        Approval(msg.sender, _spender, _value)
        returns true;
    }

    //transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);
        return true;
        
    }



}