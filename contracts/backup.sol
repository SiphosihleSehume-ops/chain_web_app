// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {AggregatorV3Interface} from
    "https://github.com/smartcontractkit/chainlink-brownie-contracts/blob/main/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import {PriceConverter} from "./PriceConverter.sol";
// NB: Gas fees effecient compared to `reverrt strings`
error NotOwner();

contract FundMe {

    // treat the functions from the `PriceConverter` library as if they were methds ona uint256 value # that
    using PriceConverter for uint256;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    address public immutable i_owner;
    // USD amount needs to be converted to the smallest unit of ETH (wei)
    uint256 public constant MINIMUM_USD = 5 * 10 ** 18;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!"); # this
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }

    modifier onlyOwner() {
        // require(msg.sender == owner); --> gas ineffecient
        if (msg.sender != i_owner) revert NotOwner(); // gas effecient
        _;
    }

    function withdraw() public onlyOwner {
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);

        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        // call
        /* make the address of the `caller (OnlyOnwner)` payable - signalling that ETH will be sent to this wallet 
         * call --: low-level call to the address of the current (in this instance to send ETH)
         * `{value: address(this).balance}` is telling the `call` how much ETH to send. IN this instance, the entire balance.
         * ("") - is the calldata being sent along with the call
         * (bool callSuccess, ) - I want the first value, but I don't care about the second
         */ 
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    // executed when a call doesn't match any specific function: safety net
    fallback() external payable {
        fund();
    }

    // triggered when someone sends ETH to the contract without providing any call data
    receive() external payable {
        fund();
    }
}
