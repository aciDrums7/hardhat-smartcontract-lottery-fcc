const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        lotteryEntranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "512", // needs this!!
        // need to setup keepers for our contract!!
        callbackGasLimit: "500000", // 500.000
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "hardhat",
        lotteryEntranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "588",
        callbackGasLimit: "500000", // 500.000
        keepersUpdateInterval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]
const FRONT_END_ADDRESSES_FILE =
    "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    FRONT_END_ADDRESSES_FILE,
    FRONT_END_ABI_FILE,
}
