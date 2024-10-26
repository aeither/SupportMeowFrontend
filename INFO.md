## TroubleShooting

```bash
yarn add prettier in agoric-sdk folder
```

## Running Local Nodes

Run it `cd multichain-testing` and

```bash
make clean setup && make start
```

check if it is running

```bash
kubectl get pod agoriclocal-genesis-0
```

Stop it

```bash
make stop && make clean
```

so to repeat the process

```bash
make stop

make clean

make clean setup

make start
```

## Getting Started

Stop Docker

```bash
yarn stop:docker
```

Start Docker

```bash
yarn start:docker
```

View Logs

```bash
yarn docker:logs
```

Enter CLI

```bash
yarn docker:bash
```

## Add Key

in root folder

```bash
make hermes-update
```

in contract folder create new wallet "alice" and import 24 words to Browser Keplr

```bash
make add-address
```

```bash
make fund
```

```bash
make e2e
```

## Run agd

add key and replace it in make file for ADDR=

```bash
kubectl exec -i agoriclocal-genesis-0 -c validator -- agd keys add alice || true
```

check balance

```bash
kubectl exec -i agoriclocal-genesis-0 -c validator -- agd query bank balances agoric1rqra0s42hwjljvd007v7let8rqfgtrsm94r0r3
```

## Theory for Contract Interaction

for querying, signing and broadcasting txs
@cosmjs/stargate
- IBC relayer
- token transfer
- keygen
- ibc relayer

for additional functionalities for smart contract
@cosmjs/cosmwasm-stargate
- smart contract query and interaction

@cosmjs/proto-signing
- for using mnemonic wallet. good for scripting