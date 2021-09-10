import _ from 'lodash';
import util from 'util';
type Bytes32 = number;

export type State = {root: Bytes32};
export type Proof = {witness: State};

// Helper functions for indices <-> steps

/**
 * Given a step range, calculates the step for an index
 * @param index The index of the state that is an element of a sequence of states
 * @param consensusStep Step number of the first state (with index 0)
 * @param highestStep Step number of the last state (with index numSplits)
 * @param numSplits The number of segments between the lowest and the highest split.
 * @returns The conversion of the index to an integer step
 */
export function stepForIndex(
  index: number,
  consensusStep: number,
  highestStep: number,
  numbSplits: number
): number {
  if (index < 0 || index >= expectedNumOfLeaves(consensusStep, highestStep, numbSplits)) {
    throw 'Invalid index';
  }
  if (index === expectedNumOfLeaves(consensusStep, highestStep, numbSplits) - 1) {
    return highestStep;
  }
  const stepDelta =
    interval(consensusStep, highestStep, numbSplits) > 1
      ? interval(consensusStep, highestStep, numbSplits)
      : 1;
  return consensusStep + Math.floor(stepDelta * index);
}

/**
 * The canonical math to calculate the split interval
 * @param consensusStep
 * @param highestStep
 * @param numSplits
 * @returns A decimal interval.
 */
export function interval(consensusStep: number, highestStep: number, numSplits: number): number {
  const stepsBetweenConsensusAndHighest = highestStep - consensusStep;
  return stepsBetweenConsensusAndHighest / numSplits;
}

/**
 * Calculate the number of leaves in a merkle tree
 * @param consensusStep
 * @param highestStep
 * @param numSplits
 * @returns An integer number of leaves
 */
export function expectedNumOfLeaves(
  consensusStep: number,
  highestStep: number,
  numSplits: number
): number {
  return interval(consensusStep, highestStep, numSplits) >= 1
    ? numSplits + 1
    : highestStep - consensusStep + 1;
}

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public consensusStep = 0;
  constructor(
    // These states are supplied by the challenger.
    // In the future, only the hash of the merkle root will be stored
    public states: State[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Bytes32,
    public caller: string,
    public highestStep: number,
    public numSplits: number
  ) {
    if (this.states.length !== expectedNumOfLeaves(this.consensusStep, highestStep, numSplits)) {
      throw new Error(`Expected ${numSplits + 1} number of states, recieved ${states.length}`);
    }
  }

  public interval(): number {
    return interval(this.consensusStep, this.highestStep, this.numSplits);
  }

  public stepForIndex(index: number): number {
    return stepForIndex(index, this.consensusStep, this.highestStep, this.numSplits);
  }

  // TODO: consensusWitness and disputedWitness will be merkle tree witnesses
  split(consensusWitness: State, states: State[], disputedWitness: State, caller: string): any {
    if (this.interval() <= 1) {
      throw new Error('States cannot be split further');
    }
    // TODO: With a merkle tree, the witness needs to be validated as opposed to compared to stored states
    const consensusIndex = this.states.findIndex(state => state.root === consensusWitness.root);
    if (consensusIndex < 0) {
      throw new Error('Consensus witness is not in the stored states');
    }
    if (consensusIndex === this.numSplits) {
      throw new Error('Consensus witness cannot be the last stored state');
    }

    if (this.states[consensusIndex + 1].root !== disputedWitness.root) {
      throw new Error('Disputed witness does not match');
    }

    if (states[states.length - 1].root === disputedWitness.root) {
      throw new Error('The last state supplied must differ from the disputed witness');
    }

    const newConsensusStep = this.stepForIndex(consensusIndex);

    // The else case is when the consensus state is the second to last state in the state list.
    // In that case, the highest step not need to be updated.
    let newHighestStep = this.highestStep;
    if (consensusIndex !== this.numSplits - 1) {
      newHighestStep = this.stepForIndex(consensusIndex + 1);
    }
    // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller
    const intermediateLeaves =
      expectedNumOfLeaves(newConsensusStep, newHighestStep, this.numSplits) - 1;
    if (states.length !== intermediateLeaves) {
      throw new Error(`Expected ${intermediateLeaves} number of states, recieved ${states.length}`);
    }

    // Effects
    this.consensusStep = newConsensusStep;
    this.highestStep = newHighestStep;
    this.states = [consensusWitness, ...states];

    this.caller = caller;
  }

  detectFraud({witness: consensusWitness}: Proof, {witness: disputedWitness}: Proof): boolean {
    if (this.interval() > 1) throw new Error('Can only detect fraud for sequential states');

    const witnessIndex = this.states.findIndex(state => state.root === consensusWitness.root);
    if (witnessIndex < 0) {
      throw new Error('Witness cannot be found in stored states');
    }
    if (witnessIndex === this.states.length - 1) {
      throw new Error('Witness cannot be the last state');
    }

    if (this.states[witnessIndex + 1].root !== disputedWitness.root) {
      throw new Error('Disputed witness does not match stored states');
    }

    const correctWitnessAfter = this.progress(consensusWitness);
    return correctWitnessAfter.root !== this.states[witnessIndex + 1].root;
  }
}
