import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import greenPortalData from "./utils/GreenPortal.json";
import Loader from './assets/Loader.gif'

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allGreens, setAllGreens] = useState([]);
  const contractAddress = "0x53CB4256AC306720dAFf78B88eEc475a6CE59bB0";
  const contractABI = greenPortalData.abi;
  const [textMessgae, updateTextMessgae] = useState(
    "I am not well!"
  );
  const [loaderStatus,setLoaderStatus] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllGreens();
  }, []);

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllGreens = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greenPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const greens = await greenPortalContract.getAllGreens();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        const greensCleaned = greens.map((green) => {
          return{
            address: green.greenSender,
            timestamp: new Date(green.timestamp * 1000),
            message: green.message,
          };
        });
        // console.log('updating')

        /*
         * Store our data in React State
         */
        setAllGreens(greensCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
  * Listen in for emitter events!
   */
  // useEffect(() => {
  //   let greenPortalContract;
  
  //   const onNewGreen = (from, timestamp, message, winner) => {
  //     console.log("NewGreen", from, timestamp, message,winner);
  //     setAllGreens(prevState => [
  //       ...prevState,
  //       {
  //         address: from,
  //         timestamp: new Date(timestamp * 1000),
  //         message: message,
  //         winner,
  //       },
  //     ]);
  //   };
  
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  
  //     greenPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  //     greenPortalContract.on("NewGreen", onNewGreen);
  //   }
  
  //   return () => {
  //     if (greenPortalContract) {
  //       greenPortalContract.off("NewGreen", onNewGreen);
  //     }
  //   };
  // }, []);

  const handlegreen = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greenPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // const greenTxn = await wavePortalContract.wave("dummy  text")

        let count = await greenPortalContract.getTotalGreens();
        console.log("Retrieved total greens count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const greenTxn = await greenPortalContract.sendGreen(textMessgae, {
          gasLimit: 300000,
        });
        console.log("Mining...", greenTxn.hash);
        setLoaderStatus(true)

        await greenTxn.wait();
        console.log("Mined -- ", greenTxn.hash);
        setLoaderStatus(false)

        count = await greenPortalContract.getTotalGreens();
        console.log("Retrieved total greens count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
    getAllGreens();
  };

  const handleTextChange = (e) => {
    console.log("message:", e.target.value);
    updateTextMessgae(e.target.value);
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">????  Sorry But I Can't Turn On My Teams Camera Because...</div>

        <div className="bio">
          Did you just wake up and join the meeting from bed and that annoying collegue/manager is asking you to turn on your camera? We feel for you! 
        </div>
        <div className="bio">
          Here are a bunch of excuses you can give. You're welcome!
        </div>
        <div className="bio">
          Feel free to add your excuses too. The best ones will win some $eth as an airdrop in their wallet!
        </div>
        <br/>
        <input type="text" onChange={handleTextChange} placeholder="What's your excuse?"></input>
        <br/>
        {loaderStatus?
        <img src={Loader} className='loading-icon'></img>
        :<button className="waveButton" onClick={handlegreen}>
          Share Excuse
        </button>}
        <br />
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {allGreens
          .slice(0)
          .reverse()
          .map((green, index) => {
            console.log("winner status",green.winner)
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "OldLace",
                  marginTop: "16px",
                  padding: "8px",
                }}
              >
                <div>Address: {green.address}</div>
                <div>Time: {green.timestamp.toString()}</div>
                <div>Message: {green.message}</div>
                {green.winner ? (
                  <div>Airdrop: Won</div>
                ) : (
                  <div>Airdrop: Lost</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
