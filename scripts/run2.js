const main = async () => {
  // const [owner, randomPerson] = await hre.ethers.getSigners();
  const greenContractFactory = await hre.ethers.getContractFactory(
    "GreenPortal"
  );
  const greenContract = await greenContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await greenContract.deployed();
  console.log("Contract deployed to:", greenContract.address);
  // console.log("Contract deployed by:", owner.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    greenContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  let greenTxn = await greenContract.sendGreen(
    "Here's a green to save the world"
  );
  await greenTxn.wait(); // Wait for the transaction to be mined

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(greenContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allGreens = await greenContract.getAllGreens();
  console.log(allGreens);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
