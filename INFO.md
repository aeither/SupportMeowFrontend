## Running Local Nodes

run it `cd multichain-testing` and

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

## Winding Down

Stop Docker

```bash
yarn stop:docker
```

## Add Key

create new wallet "alice" and import 24 words to Browser Keplr

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