import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const rpcUrl = "https://api.avax.network/ext/bc/C/rpc";
const testProvider = "https://api.avax-test.network/ext/bc/C/rpc";

const contractAddress = "";
let walletAddress = "";
let signer: any;
let provider: any;



export const connectWallet = async (setAdress: any) => {
  if (window.ethereum) {
    await window.ethereum.enable().then(async () => {
      await window.ethereum.request({
        "method": "wallet_switchEthereumChain",
        "params": [
          {
            "chainId": "0xA86A"
          }
        ]
      });
    });

    provider = new ethers.providers.Web3Provider(window!.ethereum);
    signer = await provider.getSigner();
    setAdress(await signer.getAddress());
    walletAddress = await signer.getAddress();
  } else {
    return "You should install metamask";
  }
};


export const getCurrentWalletConnected = async (setAdress: any) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        await window.ethereum.request({
          "method": "wallet_switchEthereumChain",
          "params": [
            {
              "chainId": "0xA86A"
            }
          ]
        });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        walletAddress = await signer.getAddress();
        setAdress(walletAddress);

      } else {
        return {
          address: "",
          status: "Connect Metamask",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Error",
      };
    }
  } else {
    return {
      address: "",
      status: "Install Metamask",
    };
  }
};

