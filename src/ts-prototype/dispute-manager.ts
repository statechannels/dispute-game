import {generateRoot, Hash, validateWitness, WitnessProof} from '../merkle';

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

/**
 * DisputeManager prototypes the contract to be deployed on-chain.
 * - Allows participants to split a range of states until the states provided are sequential.
 * - Allows a participant to prove fraud after splitting.
 * - Allows a participant to forfeit at any time.
 *
 * Note on indices vs steps:
 * Let's assume that Alice holds hashes [h0, h1, h2, h3, h4]. This is a list of hashes with 4 steps.
 * Alice can initialize the challenge manager with hashes [h0, h2, h4]. The challenge manager then stores the root of the merkle tree:
 *
 *       root
 *     |       |
 *   node0   node1
 *   |  |    |  |
 *  h0  h2  h4 null
 *
 * - An index of a hash is the position of the hash in the DisputeManager merkle tree leaf list.
 * - A step of a hash is the position of the hash in the complete step array.
 * So indices of [h0, h2, h4] are [0, 1, 2]. The steps of [h0, h2, h4] are [0, 2, 4].
 */
export class DisputeManager {
  public consensusStep = 0;
  public root: Hash;
  public loser = '';

  // This mimics the transaction calldata on Ethereum. This should never be read internally.
  public lastCalldata: Hash[];

  /**
   * Sets up the on-chain state for the dispute game.
   * @param stateHashes Initial hashes supplied to the dispute game.
   * @param progress Defines a valid transition from a state to the next state.
   * @param fingerprint Maps a state to the fingerprint/hash of the state.
   * @param lastMover Tracks the last participant to take a turn. In the future, a valid signature will be required.
   * @param disputedStep The step of the last stateHash supplied.
   * @param numSplits A state range is split into numSplits on contract initialization and during split operations.
   */
  constructor(
    stateHashes: Hash[],
    public progress: (state: State) => State,
    public fingerprint: (state: State) => Hash,
    public lastMover: string,
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

    const validConsensusWitness = this.validateLeafWitness(
      consensusWitness,
      this.root,
      this.treeDepth
    );
    if (!validConsensusWitness) {
      throw new Error('Invalid consensus witness proof');
    }

    const validDisputeWitness = this.validateLeafWitness(
      disputedWitness,
      this.root,
      this.treeDepth
    );
    if (!validDisputeWitness) {
      throw new Error('Invalid dispute witness proof');
    }

    if (consensusIndex + 1 !== disputedIndex) {
      throw new Error('Disputed state hash must be the next leaf after consensus state hash');
    }

    return {consensusIndex, disputedIndex};
  }

  /**
   * This only works with full, binary trees. For now, we are padding the leaves with leaves of sha256('0').
   */
  private get treeDepth(): number {
    return Math.ceil(Math.log2(this.expectedNumLeaves()));
  }

  private expectedNumLeaves(): number {
    return expectedNumOfLeaves(this.consensusStep, this.disputedStep, this.numSplits);
  }

  /**
   * Public helpers
   */
  public canSplitFurther(): boolean {
    return canSplitFurther(this.consensusStep, this.disputedStep, this.numSplits);
  }

  public stepForIndex(index: number): number {
    return stepForIndex(index, this.consensusStep, this.disputedStep, this.numSplits);
  }
  /**
   * END public helpers
   */

  /**
   * Enables a dispute game participant to take a turn.
   * @param consensusWitness Witness to the highest index hash/leaf that the participant agrees with.
   * @param hashes Hashes between the consensus hash and the disputed hash.
   * @param disputedWitness Witness to the next leaf after the consensus leaf.
   * @param mover The player taking the turn.
   */
  public split(
    consensusWitness: WitnessProof,
    hashes: Hash[],
    disputedWitness: WitnessProof,
    mover: string
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
    // The leaves are formed by concatenating consensusWitness + leaves supplied by the mover
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
    this.lastMover = mover;
    this.lastCalldata = stateHashes;
  }

  /**
   * Given two valid, sequential leaf witnesses, check for fraud and record loser if fraud is found.
   * @param consensusWitness Witness to the hash prior to the fraudulent transition.
   * @param consensusState State that hashes to the consensusWitness
   * @param disputedWitness The next leaf after the consensusWitness
   * @returns whether fraud is detected.
   */
  public detectFraud(
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
      this.loser = this.lastMover;
    }
    return fraudDetected;
  }

  /**
   * The dispute game can be forfeited at any time
   * @param mover In the future, a valid signature will be required.
   */
  public forfeit(mover: string): void {
    this.loser = mover;
  }
}
