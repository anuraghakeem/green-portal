import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
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

        <button className="waveButton" onClick={wave}>
          Share a 🌿
        </button>
      </div>
    </div>
  );
}