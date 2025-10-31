## Project Overview

This example project includes:

- ✅ A TypeScript Hardhat configuration file.
- ✅ ERC20 token contract (EEC20.sol).
- ✅ Staking contract (Staking.sol) with reward logic.
- ✅ TypeScript unit tests using mocha, chai, and ethers.js.
- ✅ Deployment scripts for local devnet and Amoy testnet.

### Set Env Variable via hardhat keystore 

To set the `PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set PRIVATE_KEY
```
To set RPC Url for Polygon:
```shell
 npx hardhat keystore set POLYGON_RPC_URL
```
To set RPC Url for amoy:
```shell
 npx hardhat keystore set AMOY_RPC_URL
```

### Make a deployment 

To run the deployment to a local chain:

```shell
npx hardhat run scripts/index.ts
```

To run the deployment to a testnet/mainnet chain:

```shell
npx hardhat run scripts/index.ts --network polygon
```
```shell
npx hardhat run scripts/index.ts --network amoy
```

## verifying contract

Use default constructuor arguments and build profile for verification (Using v2)

For token:
```bash
npx hardhat verify --network amoy --build-profile default <ContractAddress> "MetaCoin" "MTC" 1000000000000000000000000
```

For staking:
```bash
npx hardhat verify --network amoy --build-profile default <ContractAddress> 0x3370A03BF676B153e2F74F78cce47A268fd5cee8
```

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

```shell
npx hardhat test test/MyToken.ts

```

## For test:

### ERC20 Deployment:
https://amoy.polygonscan.com/address/0x3370A03BF676B153e2F74F78cce47A268fd5cee8

### Staking Deployment
https://amoy.polygonscan.com/address/0xcB998fb442a0475B2B59909cf9b1Afc0dD1Fa7df


## Running with frontend
 open dir web
 ```bash
 cd web
 ```

Update env with contract address:
```

```