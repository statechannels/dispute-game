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

  private interval(): number {
    const stepsBetweenConsensusAndHighest = this.highestStep - this.consensusStep;
    return stepsBetweenConsensusAndHighest / this.numSplits;
  }

  /**
   * When states are stored in a Merkle tree, this function calculates the number of leaves we expect.
   */
  private expectedNumOfLeaves(consensusStep: number, highestStep: number): number {
    return this.interval() >= 1 ? this.numSplits + 1 : highestStep - consensusStep + 1;
  }

  public stepForIndex(index: number): number {
    if (index < 0 || index >= this.expectedNumOfLeaves(this.consensusStep, this.highestStep)) {
      throw 'Invalid index';
    }
    if (index === this.expectedNumOfLeaves(this.consensusStep, this.highestStep) - 1) {
      return this.highestStep;
    }
    const stepDelta = this.interval() > 1 ? this.interval() : 1;
    return this.consensusStep + Math.floor(stepDelta * index);
  }

  // TODO: consensusWitness and disputedWitness will be merkle tree witnesses
  split(
    consensusWitness: State,
    states: State[],
    disputedWitness: State,
    lastSubmitter: string
  ): any {
    // TODO: With a merkle tree, the witness needs to be validated as opposed to compared to stored states
    const consensusIndex = this.states.findIndex(state => state.root === consensusWitness.root);
    if (consensusIndex < 0) {
      throw 'Consensus witness is not in the stored states';
    }
    if (consensusIndex === this.numSplits) {
      throw 'Consensus witness cannot be the last stored state';
    }

    // TODO: With a merkle tree, the witness needs to be validated as opposed to compared to stored states
    if (this.states[consensusIndex + 1].root !== disputedWitness.root) {
      throw 'Disputed witness does not match';
    }

    const newConsensusStep = this.stepForIndex(consensusIndex);
    // Effects

    // The else case is when the consensus state is the second to last state in the state list.
    // In that case, the highest step not need to be updated.
    let newHighestStep = this.highestStep;
    if (consensusIndex !== this.numSplits - 1) {
      newHighestStep = Math.floor(newConsensusStep + this.interval());
    }

    // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller + disputedWitness
    const intermediateLeaves = this.expectedNumOfLeaves(newConsensusStep, newHighestStep) - 2;
    if (states.length !== intermediateLeaves) {
      throw `Expected ${intermediateLeaves} number of states, recieved ${states.length}`;
    }

    this.consensusStep = newConsensusStep;
    this.highestStep = newHighestStep;
    this.states = [consensusWitness, ...states, disputedWitness];
    this.lastSubmitter = lastSubmitter;
  }

  detectFraud({witness}: Proof, gasLimit = 1): boolean {
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
