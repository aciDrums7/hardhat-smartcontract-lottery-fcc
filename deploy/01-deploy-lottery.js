export default async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const lottery = await deploy("Lottery", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 6
    })
}