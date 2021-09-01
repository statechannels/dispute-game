import _ from 'lodash';

type Bytes32 = number;

export type StepCommitment = {root: Bytes32; step: number};
type State = {root: Bytes32};
type Proof = {startingAt: number; witness: State};

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public incorrectStepIndex = 0;
  constructor(
    // These commitments are supplied by the challenger
    public commitments: StepCommitment[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Bytes32,
    public lastSubmitter: string
  ) {
    if (this.commitments.length < 2) {
      throw 'invalid commitment length';
    }
  }

  assertInvalidStep(index: number) {
    // checks
    if (index === 0) {
      throw 'cannot assert first step invalid';
    }

    if (index > this.commitments.length - 1) {
      throw 'Invalid challenge';
    }

    // effects
    this.incorrectStepIndex = index;
  }

  split(commitments: StepCommitment[], lastSubmitter: string): any {
    const numSplits = commitments.length - 1;
    if (numSplits < 2) {
      throw 'invalid commitment length';
    }

    // Find the first stored commitment with the step smaller than the first split commitment
    const consensusIndex =
      this.commitments
        .map(commitment => commitment.step)
        .findIndex(step => step > commitments[0].step) - 1;
    if (consensusIndex < 0 || consensusIndex === this.commitments.length - 1) {
      throw 'The first commitment step is too large';
    }

    const consensusCommitment = this.commitments[consensusIndex];
    const disputedCommitment = this.commitments[consensusIndex + 1];
    if (disputedCommitment.step <= commitments[commitments.length - 1].step) {
      throw 'The last commitment step is too large';
    }

    const validIndeces = commitments
      .map(commitments => commitments.step)
      .every((step, index, steps) => {
        const expectedStep =
          consensusCommitment.step +
          Math.floor((index * (disputedCommitment.step - consensusCommitment.step)) / numSplits);
        if (step !== Math.floor(expectedStep)) {
          return false;
        }
        return true;
      });

    if (!validIndeces) {
      throw 'Invalid indices';
    }

    // effects
    this.lastSubmitter = lastSubmitter;
    this.commitments = [this.commitments[consensusIndex], ...commitments, disputedCommitment];
  }

  detectFraud({witness, startingAt}: Proof, gasLimit = 1): boolean {
    const before = this.commitments[startingAt];
    const after = this.commitments[startingAt + 1];

    if (before.root !== witness.root) {
      return false;
    }

    let gasUsed = 0;
    for (let i = 0; i < after.step - before.step; i++) {
      gasUsed += witness.root;
      witness = this.progress(witness);
    }

    // Simulate running out of gas
    // The assumption here is that a single step can _always_ be validated on-chain.
    if (after.step - before.step > 1 && gasUsed > gasLimit) {
      throw new Error('out of gas');
    }

    return after.root !== witness.root;
  }
}
