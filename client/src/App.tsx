import React from 'react';
import { useState, useEffect } from 'react';
import { makeProof, verifyProof, generateCall } from './client';
import { connectWallet, getCurrentWalletConnected, mint, getTotalMinted, signer } from './WalletConnect';
import ReactJson from 'react-json-view';
import punkImg from './images/punk.png';
import './App.css';


const hash = "15816790041894035629812969348918251598434796263086720583354417805817603431710"


function App() {
  const [secretStr, setSecret] = useState("");

  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [latestSecretTry, setLatestSecret] = useState("");
  const [totalMinted, setTotalMinted] = useState("");
  const [address, setAddress] = useState("");

  let verificationKey = `${process.env.PUBLIC_URL}/verification_key.json`;



  const runProofs = async () => {
    let secret = "0x";

    const utf8EncodeText = new TextEncoder();
    const byteArray = utf8EncodeText.encode(secretStr);
    byteArray.forEach(e => {
      secret += e.toString(16);
    });

    let proofInput = { secret, address, hash };
    console.log(proofInput);

    try {
      let { proof, publicSignals } = await makeProof(proofInput);
      setProof(JSON.stringify(proof, null, 2));
      setSignals(JSON.stringify(publicSignals, null, 2));
      verifyProof(verificationKey, publicSignals, proof).then((_isValid) => {
        setIsValid(_isValid);
      });
    } catch {
      setProof("");
      setSecret("");
      setIsValid(false);
      setLatestSecret(secretStr);
    }


  };

  const handleSecretChange = (e: any) => {
    setSecret(e.target.value);
  };

  const handleMint = async () => {
    var res = await generateCall(JSON.parse(proof), signals);
    await mint(res);
    console.log(res);
    console.log(signer);
  };

  useEffect(() => {
    getCurrentWalletConnected(setAddress);
  }, []);

  useEffect(() => {
    if (address) {
      getTotalMinted(setTotalMinted);
      setAddress(address);
    }
  }, [address]);

  return (
    <div className='App'>
      <div className='content'>
        <div>
          <button className="walletbutton" onClick={() => connectWallet(setAddress)}>
            {address ?
              "Connected" :
              "Connect Wallet"
            }
          </button>
        </div>
        <div>
          <h1>
            Mint a ZK Punk NFT!
          </h1>
        </div>
        <div className='imgcontainer'>
          <img className='punkimg' src={punkImg} alt="punkimg" />
        </div>
        <h2>{totalMinted}/300</h2>
        <div>Total Minted!</div>
        {
          isValid && <button onClick={() => handleMint()} className="button-glitch">Mint !</button>
        }
        <div className='mt5'>
          Answer the following question! Mint the NFT with proving that you know the answer and without revealing it.
        </div>
        <div className='mt3'>
          Contracts run on Avalanche network because it is a lot cheaper. This will be your coolest NFT on Avalanche
        </div>
        <div className='mt3'>
          NFT Contract: 0xC9a1E7aFDBe56Bf6D7Da7253958C9A3Aa7C3CA8a
        </div>
        <div className='mt3'>
          Verifier Contract:  0x9a39D7518661c9019F1203cfee50FE91A7e3e923
        </div>
        <div className='mt3'>
          What message did Satoshi insert into the genesis block ?
        </div>
        <div className='mt3'>
          <textarea className='inputbox' placeholder='Answer..' value={secretStr} onChange={e => handleSecretChange(e)} />
        </div>
        <div className='mt3'>
          <button onClick={() => runProofs()}>Generate Proof</button>
        </div>
        <div className='mt3'>Result: {isValid ? "Valid proof" : "Invalid proof for secret:  " + latestSecretTry}</div>
        {
          isValid &&
          <div className='datadisplay'>
            <h3>Proof:</h3>
            <ReactJson
              src={JSON.parse(proof)}
              theme="monokai" // Optional: Choose a theme (e.g., "monokai", "apathy", "bright", etc.)
              iconStyle="circle" // Optional: Change icon style (default: "triangle")
              displayDataTypes={false} // Optional: Hide data types (default: true)
              indentWidth={4} // Optional: Specify indentation width (default: 2)
            />
            <h3>Signals:</h3>
            <ReactJson
              src={JSON.parse(signals)}
              theme="monokai" // Optional: Choose a theme (e.g., "monokai", "apathy", "bright", etc.)
              iconStyle="circle" // Optional: Change icon style (default: "triangle")
              displayDataTypes={false} // Optional: Hide data types (default: true)
              indentWidth={4} // Optional: Specify indentation width (default: 2)
            />
          </div>
        }
      </div>

    </div>
  );
}

export default App;
