import _ from 'lodash';
import {generateRoot, Hash, proofToIndex, validateWitness, WitnessProof} from './merkle';

type Bytes32 = number;

export type State = {root: Bytes32};

// Helper functions for indices <-> steps

/**
 * Given a step range, calculates the step for an index
 * @param index The index of the state that is an element of a sequence of states
 * @param consensusStep Step number of the first state (with index 0)
 * @param disputedStep Step number of the last state (with index numSplits)
 * @param numSplits The number of segments between the lowest and the highest split.
 * @returns The conversion of the index to an integer step
 */
export function stepForIndex(
  index: number,
  consensusStep: number,
  disputedStep: number,
  numbSplits: number
): number {
  if (index < 0 || index >= expectedNumOfLeaves(consensusStep, disputedStep, numbSplits)) {
    throw 'Invalid index';
  }
  if (index === expectedNumOfLeaves(consensusStep, disputedStep, numbSplits) - 1) {
    return disputedStep;
  }
  const stepDelta =
    interval(consensusStep, disputedStep, numbSplits) > 1
      ? interval(consensusStep, disputedStep, numbSplits)
      : 1;
  return consensusStep + Math.floor(stepDelta * index);
}

/**
 * The canonical math to calculate the split interval
 * @param consensusStep
 * @param disputedStep
 * @param numSplits
 * @returns A decimal interval.
 */
export function interval(consensusStep: number, disputedStep: number, numSplits: number): number {
  const stepsBetweenConsensusAndDisputed = disputedStep - consensusStep;
  return stepsBetweenConsensusAndDisputed / numSplits;
}

/**
 * Calculate the number of leaves in a merkle tree
 * @param consensusStep
 * @param disputedStep
 * @param numSplits
 * @returns An integer number of leaves
 */
export function expectedNumOfLeaves(
  consensusStep: number,
  disputedStep: number,
  numSplits: number
): number {
  return interval(consensusStep, disputedStep, numSplits) >= 1
    ? numSplits + 1
    : disputedStep - consensusStep + 1;
}

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public consensusStep = 0;
  public root: Hash;
  constructor(
    // These states are supplied by the challenger.
    // In the future, only the hash of the merkle root will be stored
    public stateHashes: Hash[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Hash,
    public caller: string,
    public disputedStep: number,
    public numSplits: number
  ) {
    if (this.stateHashes.length !== numSplits + 1) {
      throw new Error(`Expected ${numSplits + 1} number of states, recieved ${stateHashes.length}`);
    }
    this.root = generateRoot(stateHashes);
  }

  /**
   * This only works with full, binary trees. For now, we are padding the leaves with leaves of sha256('0').
   */
  public get depth() {
    return Math.ceil(Math.log2(this.expectedNumLeaves()));
  }

  public expectedNumLeaves(): number {
    return expectedNumOfLeaves(this.consensusStep, this.disputedStep, this.numSplits);
  }

  public interval(): number {
    return interval(this.consensusStep, this.disputedStep, this.numSplits);
  }

  public stepForIndex(index: number): number {
    return stepForIndex(index, this.consensusStep, this.disputedStep, this.numSplits);
  }

  split(
    consensusWitness: WitnessProof,
    hashes: Hash[],
    disputedWitness: WitnessProof,
    caller: string
  ): any {
    if (this.interval() <= 1) {
      throw new Error('States cannot be split further');
    }
    const consensusIndex = proofToIndex(consensusWitness.proof);
    const disputedIndex = proofToIndex(disputedWitness.proof);

    if (consensusIndex >= this.expectedNumLeaves() - 1) {
      throw new Error('Consensus witness cannot be the last stored state');
    }

    const validConsensusWitness = validateWitness(consensusWitness, this.root, this.depth);
    if (!validConsensusWitness) {
      throw new Error('Invalid consensus witness proof');
    }

    const validDisputeWitness = validateWitness(disputedWitness, this.root, this.depth);
    if (!validDisputeWitness) {
      throw new Error('Invalid dispute witness proof');
    }

    if (consensusIndex + 1 !== disputedIndex) {
      throw new Error('Disputed state hash must be the next leaf after consensus state hash');
    }

    if (hashes[hashes.length - 1] === disputedWitness.witness) {
      throw new Error('The last state supplied must differ from the disputed witness');
    }

    const newConsensusStep = this.stepForIndex(consensusIndex);

    // The else case is when the consensus state is the second to last state in the state list.
    // In that case, the disputed step not need to be updated.
    let newDisputedStep = this.disputedStep;
    if (consensusIndex !== this.numSplits - 1) {
      newDisputedStep = this.stepForIndex(consensusIndex + 1);
    }
    // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller
    const intermediateLeaves =
      expectedNumOfLeaves(newConsensusStep, newDisputedStep, this.numSplits) - 1;
    if (hashes.length !== intermediateLeaves) {
      throw new Error(`Expected ${intermediateLeaves} number of states, recieved ${hashes.length}`);
    }

    // Effects
    this.consensusStep = newConsensusStep;
    this.disputedStep = newDisputedStep;
    this.stateHashes = [consensusWitness.witness, ...hashes];
    this.root = generateRoot(this.stateHashes);
    this.caller = caller;
  }

  detectFraud(
    consensusWitness: WitnessProof,
    consensusState: State,
    disputedWitness: WitnessProof
  ): boolean {
    if (this.interval() > 1) throw new Error('Can only detect fraud for sequential states');

    const validConsensusWitness = validateWitness(consensusWitness, this.root, this.depth);
    if (!validConsensusWitness) {
      throw new Error('Invalid consensus witness proof');
    }

    const validDisputeWitness = validateWitness(disputedWitness, this.root, this.depth);
    if (!validDisputeWitness) {
      throw new Error('Invalid dispute witness proof');
    }

    const consensusIndex = proofToIndex(consensusWitness.proof);
    const disputedIndex = proofToIndex(disputedWitness.proof);

    if (consensusIndex >= this.expectedNumLeaves() - 1) {
      throw new Error('Consensus witness cannot be the last stored state');
    }

    if (consensusIndex + 1 !== disputedIndex) {
      throw new Error('Disputed state hash must be the next leaf after consensus state hash');
    }

    if (this.fingerprint(consensusState) !== consensusWitness.witness) {
      throw new Error('Consensus state does not match the consensusWitness');
    }

    const correctWitnessAfter = this.progress(consensusState);
    return this.fingerprint(correctWitnessAfter) !== disputedWitness.witness;
  }
}
