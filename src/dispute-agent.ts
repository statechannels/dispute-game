import {expectedNumOfLeaves, stepForIndex} from './dispute-manager';

import {generateWitness, Hash, WitnessProof} from './merkle';

import {DisputeManager, DisputeManager__factory} from './contract-types';
import {BigNumberish} from 'ethers';

enum ChallengeStatus {
  InProgress = 0,
  FraudDetected = 1,
  Forfeited = 2
}

type Identity = 'challenger' | 'proposer';
export type DisputeManagerInterface = Pick<
  DisputeManager,
  | 'split'
  | 'claimFraud'
  | 'currentStatus'
  | 'forfeit'
  | 'fraudIndex'
  | 'canSplitFurther'
  | 'getLeafIndex'
  | 'lastMover'
>;

type DisputeManagerEvent = {type: 'split'; hashes: Hash[]};
type DisputeManagerListener = (event: DisputeManagerEvent) => Promise<void>;

export type ChainContext = {
  registerListener(listener: DisputeManagerListener): void;
  deploy: (
    hashes: Hash[],
    numSteps: BigNumberish,
    lastMover: string,
    splitFactor: BigNumberish
  ) => Promise<void>;
  deployed: boolean;
  disputeManager: DisputeManagerInterface;
};
/**
 * The DisputeAgent is a dispute game participant. The agent is initialized with a set of states.
 * The agent uses the states to take turns in the dispute game.
 */
export class DisputeAgent {
  public static async create(
    identity: Identity,
    hashes: Hash[],
    numSplits: number,
    chainContext: ChainContext
  ): Promise<DisputeAgent> {
    if (!chainContext.deployed) {
      const initialStates = [];
      for (let i = 0; i < expectedNumOfLeaves(0, hashes.length - 1, numSplits); i++) {
        const index = i === 0 ? 0 : stepForIndex(i, 0, hashes.length - 1, numSplits);
        initialStates.push(hashes[index]);
      }

      await chainContext.deploy(
        initialStates,
        hashes.length - 1,

        'proposer',

        numSplits
      );
    }
    return new DisputeAgent(identity, hashes, numSplits, chainContext.disputeManager);
  }

  /**
   * DisputeAgent constructor deploys the ChallengerManager if needed
   * @param identity The identifier of the participant.
   * @param hashes  That the participant believes are correct.
   * @param numSplits After experimentation to find the optimal split number, this will likely be a constant
   * @param globalContext The blockchain context
   */
  private constructor(
    private identity: Identity,
    private hashes: Hash[],
    private numSplits: number,
    private dm: DisputeManagerInterface
  ) {}

  private async createWitnesses(hashes: Hash[]): Promise<{
    consensusWitness: WitnessProof;
    disputedWitness: WitnessProof;
  }> {
    const disagreeWithIndex = await this.firstDisputedIndex(hashes);
    const consensusWitness = generateWitness(hashes, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(hashes, disagreeWithIndex);
    return {consensusWitness, disputedWitness};
  }

  private async firstDisputedIndex(hashes: Hash[]): Promise<number> {
    for (let i = 0; i < hashes.length; i++) {
      const step = (await this.dm.getLeafIndex(i)).toNumber();
      if (hashes[i] !== this.hashes[step]) {
        return i;
      }
    }
    throw 'Did not find disputed state';
  }

  public async handleEvent(event: DisputeManagerEvent): Promise<void> {
    switch (event.type) {
      case 'split':
        await this.handleSplit(event.hashes);
        break;
      default:
        throw new Error('unreachable');
    }
  }

  /**
   * Take a turn splitting states
   * @returns whether a split was successful
   */
  public async handleSplit(hashes: Hash[]): Promise<void> {
    const lastMover = await this.dm.lastMover();
    if (lastMover === this.identity) {
      throw new Error('It is not my turn!');
    }
    const canSplitFurther = await this.dm.canSplitFurther();

    if (!canSplitFurther) {
      const status: ChallengeStatus = await this.dm.currentStatus();
      if (status === ChallengeStatus.InProgress) {
        const fraudIndex = await this.firstDisputedIndex(hashes);
        await this.dm.claimFraud(fraudIndex, this.identity);
      } else {
        throw new Error('The dispute game is already terminated.');
      }
    }

    const disagreeWithIndex = await this.firstDisputedIndex(hashes);
    const agreeWithStep = (await this.dm.getLeafIndex(disagreeWithIndex - 1)).toNumber();
    const disagreeWithStep = (await this.dm.getLeafIndex(disagreeWithIndex)).toNumber();
    const {consensusWitness, disputedWitness} = await this.createWitnesses(hashes);

    let leaves: Hash[] = [];

    for (let i = 0; i < expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.numSplits); i++) {
      const index = stepForIndex(i, agreeWithStep, disagreeWithStep, this.numSplits);
      leaves.push(this.hashes[index]);
    }

    // We only want the leaves so we slice off the parent
    leaves = leaves.slice(1);

    await this.dm.split(consensusWitness, leaves, disputedWitness, this.identity);
  }
}
