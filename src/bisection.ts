import _ from 'lodash';

type Bytes32 = number;

export type StepCommitment = {root: Bytes32; step: number};
type State = {root: Bytes32};
type Proof = {startingAt: number; witness: State};

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  constructor(
    // These commitments are supplied by the challenger
    public commitments: Bytes32[],
    public low = 0,
    public high: number,
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Bytes32,
    public lastSubmitter: string
  ) {
    if (this.commitments.length < 2) {
      throw 'invalid commitment length';
    }
  }

  split(commitments: Bytes32[], consensusIndex: number, lastSubmitter: string): any {
    if (!commitments.length) {
      throw 'invalid commitment length';
    }
    const numSplits = commitments.length;

    const consensusCommitment = this.commitments[consensusIndex];
    const disputedCommitment = this.commitments[consensusIndex + 1];

    if (commitments[numSplits - 1] == disputedCommitment) {
      throw 'must disagree with the disputed commitment';
    }

    this.commitments = [consensusCommitment].concat(commitments);

    // ugly math
    const diff = this.high - this.low;
    this.low = this.low + consensusIndex * numSplits;
    this.high = this.low + Math.floor(diff / numSplits);

    // effects
    this.lastSubmitter = lastSubmitter;
    this.commitments = [this.commitments[consensusIndex], ...commitments, disputedCommitment];
  }

  detectFraud({witness, startingAt}: Proof, gasLimit = 1): boolean {
    const before = this.commitments[startingAt];
    const after = this.commitments[startingAt + 1];

    if (this.high - this.low > this.commitments.length - 1) {
      throw 'k-section incomplete';
    }

    if (before !== witness.root) {
      return false;
    }

    return after !== witness.root;
  }
}
