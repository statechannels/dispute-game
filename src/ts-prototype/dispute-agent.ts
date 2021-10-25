import {DisputeManager, expectedNumOfLeaves, State, stepForIndex} from './dispute-manager';
import {fingerprint} from '../tests/dispute-manager.test';
import {generateWitness, WitnessProof} from '../merkle';
import {GlobalContext} from './dispute-game';

type Identity = 'challenger' | 'proposer';

//TODO: This is a prototype of the dispute agent that works with the typescript protoype of the contract
// This needs to be updated to work with the solidity version of the contract.

/**
 * The DisputeAgent is a dispute game participant. The agent is initialized with a set of states.
 * The agent uses the states to take turns in the dispute game.
 */
export class DisputeAgent {
  private dm: DisputeManager;
  /**
   * DisputeAgent constructor deploys the ChallengerManager if needed
   * @param identity The identifier of the participant.
   * @param states  That the participant believes are correct.
   * @param numSplits After experimentation to find the optimal split number, this will likely be a constant
   * @param globalContext The blockchain context
   */
  constructor(
    private identity: Identity,
    private states: State[],
    numSplits: number,
    globalContext: GlobalContext
  ) {
    if (!globalContext.disputeManager) {
      const initialStates = [];
      for (let i = 0; i < expectedNumOfLeaves(0, states.length - 1, numSplits); i++) {
        const index = i === 0 ? 0 : stepForIndex(i, 0, states.length - 1, numSplits);
        initialStates.push(states[index]);
      }

      globalContext.deployDisputeManager(
        new DisputeManager(
          initialStates.map(fingerprint),
          state => ({root: state.root + 1}),
          fingerprint,
          'proposer',
          this.states.length - 1,
          numSplits
        )
      );
    }
    this.dm = globalContext.getValidDisputeManager();
  }

  private createWitnesses(): {consensusWitness: WitnessProof; disputedWitness: WitnessProof} {
    const disagreeWithIndex = this.firstDisputedIndex();
    const consensusWitness = generateWitness(this.dm.lastCalldata, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(this.dm.lastCalldata, disagreeWithIndex);
    return {consensusWitness, disputedWitness};
  }

  private firstDisputedIndex(): number {
    for (let i = 0; i < this.dm.lastCalldata.length; i++) {
      const step = this.dm.stepForIndex(i);
      if (this.dm.lastCalldata[i] !== fingerprint(this.states[step])) {
        return i;
      }
    }
    throw 'Did not find disputed state';
  }

  /**
   * Take a turn splitting states
   * @returns whether a split was successful
   */
  public split(): boolean {
    if (this.dm.lastMover === this.identity) {
      throw new Error('It is not my turn!');
    }
    if (!this.dm.canSplitFurther()) {
      return false;
    }

    const disagreeWithIndex = this.firstDisputedIndex();
    const agreeWithStep = this.dm.stepForIndex(disagreeWithIndex - 1);
    const disagreeWithStep = this.dm.stepForIndex(disagreeWithIndex);
    const {consensusWitness, disputedWitness} = this.createWitnesses();

    let leaves: State[] = [];

    for (
      let i = 0;
      i < expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.dm.numSplits);
      i++
    ) {
      const index = stepForIndex(i, agreeWithStep, disagreeWithStep, this.dm.numSplits);
      leaves.push(this.states[index]);
    }

    // We only want the leaves so we slice off the parent
    leaves = leaves.slice(1);

    this.dm.split(consensusWitness, leaves.map(fingerprint), disputedWitness, this.identity);

    return true;
  }

  /**
   * Attempt to prove fraud. If not able to prove fraud, forfeit the dispute game.
   * @returns whether fraud was proven.
   */
  public proveFraudOrForfeit(): boolean {
    const disagreeWithIndex = this.firstDisputedIndex();

    const consensusWitness = generateWitness(this.dm.lastCalldata, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(this.dm.lastCalldata, disagreeWithIndex);
    const detectedFraud = this.dm.detectFraud(
      consensusWitness,
      this.states[this.dm.stepForIndex(disagreeWithIndex - 1)],
      disputedWitness
    );
    if (!detectedFraud) {
      this.dm.forfeit(this.identity);
    }
    return detectedFraud;
  }
}
