import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatVerify],
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
    blockscout: {
      enabled: false,
    },
  },
  chainDescriptors: {
    80002: {
      name: "Polygon Amoy",
      blockExplorers: {
        etherscan: {
          name: "PolygonScan Amoy",
          url: "https://amoy.polygonscan.com",
          apiUrl: "https://api.etherscan.io/v2/api",
        },
      },
    },
    137: {
      name: "Polygon",
      blockExplorers: {
        etherscan: {
          name: "PolygonScan",
          url: "https://polygonscan.com",
          apiUrl: "https://api.etherscan.io/v2/api",
        },
      },
    },
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    polygon: {
      type: "http",
      chainType: "l1",
      url: configVariable("POLYGON_RPC_URL"), // e.g. Alchemy/Infura endpoint
      accounts: [configVariable("PRIVATE_KEY")],
    },
    amoy: {
      type: "http",
      chainType: "l1",
      url: configVariable("AMOY_RPC_URL"), // e.g. Alchemy/Infura endpoint
      accounts: [configVariable("PRIVATE_KEY")],
    },
  },
};

export default config;
