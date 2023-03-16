const { assert, expect, AssertionError } = require("chai")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery", async () => {
          let lottery, lotteryEntranceFee, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              lottery = await ethers.getContract("Lottery")
              lotteryEntranceFee = await lottery.getEntranceFee()
          })

          describe("fulfillRandomWorkds", async () => {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  // enter the lottery
                  const startingTimeStamp = await lottery.getLatestTimestamp()
                  const accounts = await ethers.provider.getSigner()
                  // setup the listener before we enter the lottery
                  // Just in case the blockchain moves REALLY fast

                  await new Promise(async (resolve, reject) => {
                      lottery.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              const recentWinner = await lottery.getRecentWinner()
                              const lotteryState = await lottery.getLotteryState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await lottery.getLatestTimestamp()
                              //   add our asserts here
                              //   assert.equal(numPlayers.toString(), "0")
                              await expect(lottery.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(lotteryState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(lotteryEntranceFee.toString())
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      //   Then entering the lottery
                      await lottery.enterLottery({ value: lotteryEntranceFee })
                      const winnerStartingBalance = await accounts[0].getBalance()
                      //   and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
