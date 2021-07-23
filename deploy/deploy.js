const deployFunc = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const deployResult = await deploy("Prizes", {
    from: deployer,
    gasLimit: 4000000,
    args: ['Taller 2 - Achievements', 'T2A'],
  });
  console.log(`Prizes deployed at ${deployResult.address}`);
  return hre.network.live; // prevents re execution on live networks
};
module.exports = deployFunc;

deployFunc.id = "deploy_seedifyuba"; // id required to prevent reexecution
