# Dispute Game

The dispute game involves 2 parties. The parties agree on an initial state but disagree on a final state. Initial and final states are separated by a sequence of transitions. Once initiated, the dispute game forces the participants to narrow the dispute to a single transition. The transition can then be validated by the rules of the system.

The aim is to create a formally verified, generic implementation not tied to a specific virtual machine.

## Typescript Prototype

The ts-prototype folder contains a prototype of the:

- dispute game contract

- dispute game agent

There is a [suite of tests](./ts-prototype/tests/dispute-manager.test.ts) that test the typescript prototype that can be run via `yarn test:ts`

## Solidity Prototype

The solidity prototype implements the [dispute manager contract](./sol-prototype/dispute-manager.sol).

There is currently no dispute agent that works with solidity prototype but there is a [test suite](sol-prototype/tests/dispute-manager.test.ts) that can be with the command `yarn test:sol`

Many more details about the dispute game are described in the [design document](./design-doc.md).

This prototype is inspired by the [Arbitrum implementation](https://github.com/OffchainLabs/arbitrum/blob/a422254648d4ba41f6f09ec7430f01166e747cd2/packages/arb-bridge-eth/contracts/challenge/Challenge.sol#L1).
