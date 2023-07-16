import { ethers } from "ethers";
import ABI from "./utils/ABI.json";


const contractAddress = "0xC9a1E7aFDBe56Bf6D7Da7253958C9A3Aa7C3CA8a";
export let signer: any;
let provider: any;
let contract: any;




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
    contract = new ethers.Contract(contractAddress, ABI, signer);
    setAdress(await signer.getAddress());
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
        contract = new ethers.Contract(contractAddress, ABI, signer);
        setAdress(await signer.getAddress());

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

export const mint = async (args: any) => {
  await contract.mint(args.a, args.b, args.c, JSON.parse(args._publicSignals));
}

export const getTotalMinted = async (setter: any) => {
  if (contract) {
    const res = await contract.latestToken();

    setter(parseInt(res) - 1);

    return res;
  }
}

