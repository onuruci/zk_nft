import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const FUJI_PRIVATE_KEY: any = process.env.FUJI_PRIVATE_KEY;
const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: API_KEY
  },
  solidity: {
    compilers: [
      {
        version: "0.6.11",
      },
      {
        version: "0.8.19",
      },
    ],
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [FUJI_PRIVATE_KEY],
      chainId: 43113,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY],
      chainId: 43114,
    }
  }
};

export default config;
