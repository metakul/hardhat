import { getContract } from "thirdweb";
import { polygonAmoy } from 'thirdweb/chains';

// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const defaultChain = polygonAmoy; 
 
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_PUBLIC_THIRDWEB_CLIENT_ID,
});

// src/config.ts
export const config = {
  erc20ContractAddress: import.meta.env.VITE_TOKEN_ADDRESS,
  stakeContractAddress: import.meta.env.VITE_STAKING_ADDRESS,
};

export const erc20contract = getContract({
  client,
  address: config.erc20ContractAddress,
  chain: defaultChain,
});

export const stakingContract = getContract({
  client,
  address: config.stakeContractAddress,
  chain: defaultChain,
});