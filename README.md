## Project Overview

This example project includes:

- ✅ A TypeScript Hardhat configuration file.
- ✅ ERC20 token contract (MyToken.sol).
- ✅ Staking contract (Staking.sol) with reward logic.
- ✅ TypeScript unit tests using mocha, chai, and ethers.js.
- ✅ Deployment scripts for local devnet and Sepolia testnet.
- ✅ Example .env configuration for private keys and RPC URLs.

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `mocha` tests:

```shell
npx hardhat test solidity
npx hardhat test mocha
```
You can also selectively run a single test file:
```
npx hardhat test test/MyToken.ts

```

### Make a deployment to Local chain

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```
To deploy ERC20
```shell
npx hardhat ignition deploy ignition/modules/deployErc20.ts
```
### Make a deployment to Sepolia

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```


## For test:

### ERC20 Deployment:
https://polygonscan.com/token/0x6A74DB6b1bc1a348DEE98d8A4352AEA1906A3508

### Staking Deployment