import {ChallengeManager, expectedNumOfLeaves, State, stepForIndex} from './challenge-manager';
import {fingerprint, Role} from './tests/challenge-manager.test';
import {generateWitness, WitnessProof} from './merkle';

/**
 * The ChallengerAgent is a dispute game participant. The agent is initialized with a set of states.
 * The agent uses the states to take turns in the dispute game.
 */
export class ChallengerAgent {
  constructor(
    public role: Role,
    public cm: ChallengeManager,
    public states: State[],
    public numSplits: number
  ) {}

  private createWitnesses(): {consensusWitness: WitnessProof; disputedWitness: WitnessProof} {
    const disagreeWithIndex = this.firstDisputedIndex();
    const consensusWitness = generateWitness(this.cm.lastCalldata, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(this.cm.lastCalldata, disagreeWithIndex);
    return {consensusWitness, disputedWitness};
  }

  private firstDisputedIndex(): number {
    for (let i = 0; i < this.cm.lastCalldata.length; i++) {
      const step = this.cm.stepForIndex(i);
      if (this.cm.lastCalldata[i] !== fingerprint(this.states[step])) {
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
    if (this.cm.caller === this.role) {
      throw new Error('It is not my turn!');
    }
    if (!this.cm.canSplitFurther()) {
      return false;
    }

    const disagreeWithIndex = this.firstDisputedIndex();
    const agreeWithStep = this.cm.stepForIndex(disagreeWithIndex - 1);
    const disagreeWithStep = this.cm.stepForIndex(disagreeWithIndex);
    const {consensusWitness, disputedWitness} = this.createWitnesses();

    let leaves: State[] = [];

    for (let i = 0; i < expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.numSplits); i++) {
      const index = stepForIndex(i, agreeWithStep, disagreeWithStep, this.numSplits);
      leaves.push(this.states[index]);
    }

    // We only want the leaves so we slice off the parent
    leaves = leaves.slice(1);

    this.cm.split(consensusWitness, leaves.map(fingerprint), disputedWitness, this.role);

    return true;
  }

  /**
   * Attempt to prove fraud. If not able to prove fraud, forfeit the dispute game.
   * @returns whether fraud was proven.
   */
  public proveFraudOrForfeit(): boolean {
    const disagreeWithIndex = this.firstDisputedIndex();

    const consensusWitness = generateWitness(this.cm.lastCalldata, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(this.cm.lastCalldata, disagreeWithIndex);
    const detectedFraud = this.cm.detectFraud(
      consensusWitness,
      this.states[this.cm.stepForIndex(disagreeWithIndex - 1)],
      disputedWitness
    );
    if (!detectedFraud) {
      this.cm.forfeit(this.role);
    }
    return detectedFraud;
  }
}
