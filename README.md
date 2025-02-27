
![CleanShot 2024-10-27 at 11 20 55@2x](https://github.com/user-attachments/assets/1e6d5e56-8f28-426a-975d-e390cb8fe5df)


## Backend

https://github.com/armsves/SupportMEowBackend

## Description

A blockchain platform where animal shelters inscribe their cats' photos as digital assets on Asteroid, creating a direct bridge between rescue cats and crypto supporters through verifiable donations.

## 🚀 Key Features
AI-powered cat image verification
Cross-chain inscriptions via IBC
IPFS temporary storage
Blockchain-based donation system
Image hash verification system

## 🛠 Technical Stack
Frontend: Agoric Dapp Template
Backend: Warden AI Verification
Blockchain: Asteroid (inscriptions), ATOM (donations)
Storage: IPFS (temporary)
Cross-chain: IBC messaging

## 🔄 How It Works
Image Upload & Verification
- Users submit shelter cat images
- AI system verifies authenticity of cat images
- Only verified cat images proceed to inscription
Cross-Chain Inscription Process
- Image temporarily stored on IPFS
- IBC message sent with IPFS CID as memo
- Logging bot listens for memo information
- Image inscribed on Asteroid
- IPFS file automatically deleted post-inscription
Donation System
- Browse inscribed cats in list view
- Send ATOM donations directly to shelters
- Transparent and immediate transaction processing

# Agoric Orchestration Basics Dapp

<img src="./images/orca2.png" width="100%" />

## Overview

The Orchestration Basics dApp showcases various features of the orchestration API running inside of an end-to-end environment, and a user interface:


## Set up the local environment

- Follow the instructions in `agoric-sdk/multichain-testing/README.md` to setup local multi-chain environment needed to run and test dApp. You can run `agd status` to check if this was successful.

- Run the following in the top level directory of `dapp-orchestration-basics` to run `hermes update` in the background:

```sh
make hermes-update & 
```

## Fund the account
- Run the following in the `contract/` directory of `dapp-orchestration-basics`:
```
make fund
```
This will fund `ADDR`, `CLIENTADDR`, and `CLIENT_OSMO_ADDR` as defined in `contract/Makefile`.

## Build & Deploy the dapp
- From the `contract/` directory of `dapp-orchestration-basics`, run:
```
make e2e
```
Wait for this step to complete (this could take a while!) before you start UI in the next.
## Start UI
- Run the following inside of the `ui/` directory of `dapp-orchestration-basics`:
```sh
yarn dev
```

<img src="./images/ui.png" width="100%" />

--- 

# Tests
From top-level directory:
```
make test-orca
```

# tests from root directory
```
yarn cache clean; yarn; yarn workspace dapp-agoric-orca-contract test ; rm -rf -v yarn.lock package-lock.json node_modules contract/node_modules; yarn; yarn workspace dapp-agoric-orca-contract test
```

without clean:
```
yarn workspace dapp-agoric-orca-contract deploy
```

# deploy from root directory 
```
yarn cache clean; yarn; yarn workspace dapp-agoric-orca-contract test ; rm -rf -v yarn.lock package-lock.json node_modules contract/node_modules; yarn; yarn workspace dapp-agoric-orca contract:deploy
```

without clean:
```
yarn workspace dapp-agoric-orca-contract deploy
```

# e2e build/deploy
```
yarn workspace dapp-agoric-orca-contract deployc
```

# e2e environment using `multichain-testing`
using starship
```
make teardown ; make stop; make stop-forward; make clean; make; make port-forward
```

# e2e workspaces
```
yarn workspace dapp-agoric-orca-contract build; yarn workspace dapp-agoric-orca-contract e2e
```

# note
Troubleshooting remote calls

If an ordinary synchronous call (obj.method()) fails because the method doesn't exist, the obj may be remote, in which case E(obj).method() might work.

# ensure to override the chain registry (from inside multichain-testing):

```
yarn build (from agoric-sdk root)
make override-chain-registry
```

# funding on osmosis
```console
osmosisd tx bank send faucet osmo1dw3nep8yqy5szzxn6hmma6j2z77vp4wz8tkh0w3gyrruwny0w03s070kaa 299999999uosmo --chain-id osmosislocal --gas-adjustment 2 --gas auto --from faucet --gas-prices 0.0025uosmo
```

example rpc for balances:
```
http://127.0.0.1:26657/abci_query?path=%22/cosmos.bank.v1beta1.Query/AllBalances%22&data=%22%5Cn-agoric12j5kzvrwunqvrga5vm4zpy3mkeh3lvyld0amz5%22
```

# tmp fund ica
```console
agd tx bank send keplr1 agoric15ch7da0d8nvqc8hk6dguq4ext0lvskpjcwm3patf8sygm63chmpqjlzt74 1000uist -y --chain-id agoriclocal
```

# Interface
you can run `yarn dev` inside of the `ui` folder. 

<img src="./images/ui.png" width="100%" />

![Flux](https://github.com/user-attachments/assets/64f03e69-893a-49c1-a2ad-b6d590232110)

