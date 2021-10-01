# Dispute Game

The dispute game involves 2 parties. The parties agree on an initial state but disagree on a final state. Initial and final states are separated by a sequence of transitions. Once initiated, the dispute game forces the participants to narrow the dispute to a single transition. The transition can then be validated by the rules of the system.

The aim is to create a formally verified, generic implementation not tied to a specific virtual machine. The prototype is currently implemented in Typescript for ease of iteration. Eventually, Typescript will be converted to Solidity.

Many more details about the dispute game are described in the [design document](https://statechannels.notion.site/Draft-dispute-game-specification-2eee37cd8cc943759405a9ef97885411).

This prototype is inspired by the [Arbitrum implementation](https://github.com/OffchainLabs/arbitrum/blob/a422254648d4ba41f6f09ec7430f01166e747cd2/packages/arb-bridge-eth/contracts/challenge/Challenge.sol#L1).
