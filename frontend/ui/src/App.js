import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import greenPortalData from './utils/GreenPortal.json'

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = '0x19b56B3250b509d32c6AC7E22069B900E923741F';
  const contractABI = greenPortalData.abi;

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
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

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

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  const handlegreen = async() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greenPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await greenPortalContract.getTotalGreens();
        console.log("Retrieved total greens count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const greenTxn = await greenPortalContract.sendGreen();
        console.log("Mining...", greenTxn.hash);

        await greenTxn.wait();
        console.log("Mined -- ", greenTxn.hash);

        count = await greenPortalContract.getTotalGreens();
        console.log("Retrieved total greens count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
         Hi there!
        </div>

        <div className="bio">
        I am Anurag and I am spreading greens throught the world. Connect your Ethereum wallet and help me save the world!
        </div>

        <button className="waveButton" onClick={handlegreen}>
          Share a 🌿
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}