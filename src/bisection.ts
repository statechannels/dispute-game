import _ from 'lodash';

type Bytes32 = number;

export type State = {root: Bytes32};
type Proof = {witness: State};

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public consensusStep = 0;
  constructor(
    // These states are supplied by the challenger
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

  private expectedNumStates(): number {
    return this.interval() >= 1 ? this.numSplits - 1 : this.highestStep - this.consensusStep;
  }

  // TODO: consensusWitness will be merkle tree witness
  split(consensusWitness: State, states: State[], lastSubmitter: string): any {
    if (states.length !== this.expectedNumStates()) {
      throw `Expected ${this.expectedNumStates()} number of states, recieved ${states.length}`;
    }

    const consensusIndex = this.states.findIndex(state => state.root === consensusWitness.root);

    if (consensusIndex < 0) {
      throw 'Consensus witness is not in the stored states';
    }

    if (consensusIndex === this.numSplits) {
      throw 'Consensus witness cannot be the last stored state';
    }

    const newConsensusStep = this.consensusStep + Math.floor(consensusIndex * this.interval());
    // Effects

    // The else case is when the consensus state is the second to last state in the state list.
    // In that case, the highest step not need to be updated.
    if (consensusIndex !== this.numSplits - 1) {
      this.highestStep = Math.floor(newConsensusStep + this.interval());
    }
    this.consensusStep = newConsensusStep;
    this.states = [this.states[consensusIndex], ...states, this.states[consensusIndex + 1]];
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
