import {generateRoot, Hash, validateWitness, WitnessProof} from './merkle';

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
  numSplits: number
): number {
  if (index < 0 || index >= expectedNumOfLeaves(consensusStep, disputedStep, numSplits)) {
    throw 'Invalid index';
  }
  if (index === expectedNumOfLeaves(consensusStep, disputedStep, numSplits) - 1) {
    return disputedStep;
  }

  // Simulate integer-only math since Solidity does not support floating point math
  if (Math.floor((disputedStep - consensusStep) / numSplits) === 0) {
    return consensusStep + index;
  }

  return consensusStep + Math.floor(((disputedStep - consensusStep) / numSplits) * index);
}

/**
 * The canonical math to calculate the split interval
 * @param consensusStep
 * @param disputedStep
 * @param numSplits
 * @returns A decimal interval.
 */

export function canSplitFurther(
  consensusStep: number,
  disputedStep: number,
  numSplits: number
): boolean {
  return disputedStep - consensusStep > numSplits;
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
  return canSplitFurther(consensusStep, disputedStep, numSplits)
    ? numSplits + 1
    : disputedStep - consensusStep + 1;
}

// When implemented in Solidity, the challenger will deploy the contract
export class ChallengeManager {
  public consensusStep = 0;
  public root: Hash;
  public loser = '';

  // This mimics the transaction calldata on Ethereum. This should never be read internally.
  public lastCalldata: Hash[];

  constructor(
    stateHashes: Hash[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Hash,
    public caller: string,
    public disputedStep: number,
    public numSplits: number
  ) {
    if (numSplits < 2) {
      throw new Error(`Expected numSplits of at least 2, received ${numSplits}`);
    }
    if (stateHashes.length !== numSplits + 1) {
      throw new Error(`Expected ${numSplits + 1} number of states, recieved ${stateHashes.length}`);
    }
    this.lastCalldata = stateHashes;
    this.root = generateRoot(stateHashes);
  }

  /**
   * This only works with full, binary trees. For now, we are padding the leaves with leaves of sha256('0').
   */
  public get depth(): number {
    return Math.ceil(Math.log2(this.expectedNumLeaves()));
  }

  public expectedNumLeaves(): number {
    return expectedNumOfLeaves(this.consensusStep, this.disputedStep, this.numSplits);
  }

  public canSplitFurther(): boolean {
    return canSplitFurther(this.consensusStep, this.disputedStep, this.numSplits);
  }

  public stepForIndex(index: number): number {
    return stepForIndex(index, this.consensusStep, this.disputedStep, this.numSplits);
  }

  private validateLeafWitness(witnessProof: WitnessProof, root: string, depth: number): boolean {
    if (witnessProof.nodes.length !== depth) {
      throw new Error(
        `The witness provided is not for a leaf node. Expected ${depth} witness length, recieved ${witnessProof.nodes.length}`
      );
    }
    return validateWitness(witnessProof, root);
  }

  private checkConsensusAndDisputeWitnesses(
    consensusWitness: WitnessProof,
    disputedWitness: WitnessProof
  ): {consensusIndex: number; disputedIndex: number} {
    const consensusIndex = consensusWitness.index;
    const disputedIndex = disputedWitness.index;

    if (consensusIndex >= this.expectedNumLeaves() - 1) {
      throw new Error('Consensus witness cannot be the last stored state');
    }

    const validConsensusWitness = this.validateLeafWitness(consensusWitness, this.root, this.depth);
    if (!validConsensusWitness) {
      throw new Error('Invalid consensus witness proof');
    }

    const validDisputeWitness = this.validateLeafWitness(disputedWitness, this.root, this.depth);
    if (!validDisputeWitness) {
      throw new Error('Invalid dispute witness proof');
    }

    if (consensusIndex + 1 !== disputedIndex) {
      throw new Error('Disputed state hash must be the next leaf after consensus state hash');
    }

    return {consensusIndex, disputedIndex};
  }

  public split(
    consensusWitness: WitnessProof,
    hashes: Hash[],
    disputedWitness: WitnessProof,
    caller: string
  ): void {
    if (!this.canSplitFurther()) {
      throw new Error('States cannot be split further');
    }

    const {consensusIndex} = this.checkConsensusAndDisputeWitnesses(
      consensusWitness,
      disputedWitness
    );

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

    const stateHashes = [consensusWitness.witness, ...hashes];

    // Effects
    this.consensusStep = newConsensusStep;
    this.disputedStep = newDisputedStep;
    this.root = generateRoot(stateHashes);
    this.caller = caller;
    this.lastCalldata = stateHashes;
  }

  detectFraud(
    consensusWitness: WitnessProof,
    consensusState: State,
    disputedWitness: WitnessProof
  ): boolean {
    if (this.canSplitFurther()) throw new Error('Can only detect fraud for sequential states');

    this.checkConsensusAndDisputeWitnesses(consensusWitness, disputedWitness);

    if (this.fingerprint(consensusState) !== consensusWitness.witness) {
      throw new Error('Consensus state does not match the consensusWitness');
    }

    const correctWitnessAfter = this.progress(consensusState);
    const fraudDetected = this.fingerprint(correctWitnessAfter) !== disputedWitness.witness;
    if (fraudDetected) {
      this.loser = this.caller;
    }
    return fraudDetected;
  }

  forfeit(caller: string): void {
    this.loser = caller;
  }
}
