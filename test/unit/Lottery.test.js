const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", async () => {
          let lottery, vrfCoordinatorV2Mock, lotteryEntranceFee, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              lottery = await ethers.getContract("Lottery")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              lotteryEntranceFee = await lottery.getEntranceFee()
              interval = await lottery.getInterval()
          })

          describe("constructor", async () => {
              it("initializes the lottery correctly", async () => {
                  // Ideally we make our tests have just 1 assert per "it"
                  const lotteryState = await lottery.getLotteryState()
                  assert.equal(lotteryState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["keepersUpdateInterval"])
              })
          })

          describe("enterLottery", async () => {
              it("reverts when you don't pay enough", async () => {
                  await expect(lottery.enterLottery()).to.be.revertedWith(
                      "Lottery__NotEnoughETHEntered"
                  )
              })
              it("records players when they enter", async () => {
                  await lottery.enterLottery({ value: lotteryEntranceFee })
                  const playerFromContract = await lottery.getPlayer(0)
                  assert.equal(playerFromContract.toString(), deployer)
              })
              it("emits event on enter", async () => {
                  await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
              })
              it("doesn't allow entrance when lottery is calculating", async () => {
                  await lottery.enterLottery({ value: lotteryEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  //   network.provider.request({method: "evm_mine", params: []})
                  await network.provider.send("evm_mine", [])
                  // We pretend to be a Chainlink Keeper
                  await lottery.performUpkeep([])
                  // Now the lottery is in calculating state
                  await expect(
                      lottery.enterLottery({ value: lotteryEntranceFee })
                  ).to.be.revertedWith("Lottery__NotOpen")
              })
          })

          descirbe("checkUpkeed", async () => {
            it("returns false if people haven't send any ETH", async () => {
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine", [])
            })
          })
      })
