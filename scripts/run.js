const main = async () => {
    // const [owner, randomPerson] = await hre.ethers.getSigners();
    const greenContractFactory = await hre.ethers.getContractFactory("GreenPortal");
    const greenContract = await greenContractFactory.deploy();
    await greenContract.deployed();
    console.log("Contract deployed to:", greenContract.address);
    // console.log("Contract deployed by:", owner.address);

    let greensCount;
    greensCount = await greenContract.getTotalGreens();
    console.log(greensCount.toNumber());

    /**
   * Let's send a few waves!
   */
    // let greenTxn = await greenContract.connect(randomPerson).sendGreen();
    let greenTxn = await greenContract.sendGreen("Here's a green to save the world");
    await greenTxn.wait(); // Wait for the transaction to be mined

    const [_, randomPerson] = await hre.ethers.getSigners();
    greenTxn = await greenContract.connect(randomPerson).sendGreen("Another green to save the world!");
    await greenTxn.wait(); // Wait for the transaction to be mined

    let allGreens = await greenContract.getAllGreens();
    console.log(allGreens)
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