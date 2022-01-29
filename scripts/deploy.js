const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const greenContractFactory = await hre.ethers.getContractFactory("GreenPortal");
    const greenContract = await greenContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
    });

    await greenContract.deployed();
  
    console.log("GreenPortal address: ", greenContract.address);
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