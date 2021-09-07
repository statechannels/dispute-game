import _ from 'lodash';

type Bytes32 = number;

export type State = {root: Bytes32};
type Proof = {witness: State};

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public consensusStep = 0;
  constructor(
    // These states are supplied by the challenger.
    // In the future, only the hash of the merkle root will be stored
    public states: State[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Bytes32,
    public lastSubmitter: string,
    public highestStep: number,
    public numSplits: number
  ) {
    if (this.states.length !== numSplits + 1) {
      throw `Expected ${numSplits + 1} number of states, recieved ${states.length}`;
    }
  }

  private interval(consensusStep = this.consensusStep, highestStep = this.highestStep): number {
    const stepsBetweenConsensusAndHighest = highestStep - consensusStep;
    return stepsBetweenConsensusAndHighest / this.numSplits;
  }

  /**
   * When states are stored in a Merkle tree, this function calculates the number of leaves we expect.
   */
  public expectedNumOfLeaves(consensusStep: number, highestStep: number): number {
    return this.interval(consensusStep, highestStep) >= 1
      ? this.numSplits + 1
      : highestStep - consensusStep + 1;
  }

  public stepForIndex(
    index: number,
    consensusStep: number = this.consensusStep,
    highestStep: number = this.highestStep
  ): number {
    if (index < 0 || index >= this.expectedNumOfLeaves(consensusStep, highestStep)) {
      throw 'Invalid index';
    }
    if (index === this.expectedNumOfLeaves(consensusStep, highestStep) - 1) {
      return highestStep;
    }
    const stepDelta =
      this.interval(consensusStep, highestStep) > 1 ? this.interval(consensusStep, highestStep) : 1;
    return consensusStep + Math.floor(stepDelta * index);
  }

  // TODO: consensusWitness and disputedWitness will be merkle tree witnesses
  split(consensusWitness: State, states: State[], lastSubmitter: string): any {
    if (this.interval() <= 1) {
      throw new Error('States cannot be split further');
    }
    // TODO: With a merkle tree, the witness needs to be validated as opposed to compared to stored states
    const consensusIndex = this.states.findIndex(state => state.root === consensusWitness.root);
    if (consensusIndex < 0) {
      throw 'Consensus witness is not in the stored states';
    }
    if (consensusIndex === this.numSplits) {
      throw 'Consensus witness cannot be the last stored state';
    }

    const newConsensusStep = this.stepForIndex(consensusIndex);

    // The else case is when the consensus state is the second to last state in the state list.
    // In that case, the highest step not need to be updated.
    let newHighestStep = this.highestStep;
    if (consensusIndex !== this.numSplits - 1) {
      newHighestStep = Math.floor(newConsensusStep + this.interval());
    }

    // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller
    const intermediateLeaves = this.expectedNumOfLeaves(newConsensusStep, newHighestStep) - 1;
    if (states.length !== intermediateLeaves) {
      throw `Expected ${intermediateLeaves} number of states, recieved ${states.length}`;
    }

    // Effects
    this.consensusStep = newConsensusStep;
    this.highestStep = newHighestStep;
    this.states = [consensusWitness, ...states];
    this.lastSubmitter = lastSubmitter;
  }

  detectFraud({witness}: Proof): boolean {
    if (this.interval() > 1) throw new Error('Can only detect fraud for sequential states');

    const witnessIndex = this.states.findIndex(state => state.root === witness.root);
    if (witnessIndex < 0) {
      throw 'Witness cannot be found in stored states';
    }
    if (witnessIndex === this.states.length - 1) {
      throw 'Witness cannot be the last state';
    }

    const correctWitnessAfter = this.progress(witness);
    return correctWitnessAfter.root !== this.states[witnessIndex + 1].root;
  }
}
