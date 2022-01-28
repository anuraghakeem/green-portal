const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const greenContractFactory = await hre.ethers.getContractFactory("GreenPortal");
    const greenContract = await greenContractFactory.deploy();
    await greenContract.deployed();
    console.log("Contract deployed to:", greenContract.address);
    console.log("Contract deployed by:", owner.address);

    let greensCount;
    greensCount = await greenContract.getTotalGreens();

    let greenTxn = await greenContract.connect(randomPerson).sendGreen();
    await greenTxn.wait();

    greensCount = await greenContract.getTotalGreens();
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