const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

// 0.25 is the "premium": it costs 0.25 LINK per request
const BASE_FEE = ethers.utils.parseETH("0.25")
// calculated value based on the gas price of the chain
// Link per gas
const GAS_PRICE_LINK = 1e9

// ETH price 1,000,000,000
// Chainlink Nodes pay the gas fees to give us randomness & to do external execution
// So the price of requests change based on the price of gas

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vrfCoordinatorV2...
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args
        })
        log("Mocks deployed!")
        log("--------------------------------------------------------------------------------")
    }
}