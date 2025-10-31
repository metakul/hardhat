import { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function App() {
const address = useAddress();
console.log(import.meta.env.VITE_TOKEN_ADDRESS);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold">ERC20 Staking DApp</h1>
      <h1 className="text-3xl font-bold">Address {address}</h1>
      
      <ConnectWallet />
    
    </div>
  );
}
