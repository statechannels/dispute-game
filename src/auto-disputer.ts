import _ from 'lodash';
import {
  ChallengeManager,
  State,
  interval,
  expectedNumOfLeaves,
  stepForIndex,
  Proof
} from './bisection';
import {Role} from './bisection.test';

export class AutomaticDisputer {
  private cm: ChallengeManager;
  private role: Role = 'proposer';

  constructor(
    public numSplits: number,
    public challengerStates: State[],
    public proposerStates: State[]
  ) {
    this.cm = new ChallengeManager(
      this.generateInitialStates(this.numSplits, proposerStates),
      state => ({root: state.root + 1}),
      state => state.root,
      this.role,
      this.challengerStates.length - 1,
      this.numSplits
    );
  }
  private myStates(): State[] {
    const states = this.role === 'challenger' ? this.challengerStates : this.proposerStates;
    return states;
  }

  private generateInitialStates(numSplits: number, states: State[]): State[] {
    const intervalAmount = Math.floor(interval(0, states.length, numSplits));

    const initialStates: State[] = [];

    // We want to stop before the last state
    // So we can manually add it the last state
    for (let i = 0; i < numSplits; i++) {
      const index = Math.max(0, i * intervalAmount - 1);
      initialStates.push(states[index]);
    }
    // Add the very last state
    initialStates.push(states[states.length - 1]);
    return initialStates;
  }
  private firstDisputedIndex(): number {
    for (let i = 0; i < this.cm.states.length; i++) {
      const step = this.cm.stepForIndex(i);
      if (this.cm.states[i].root !== this.myStates()[step].root) {
        return i;
      }
    }
    throw 'Did not find disputed state';
  }

  private switchRole() {
    if (this.role === 'challenger') {
      this.role = 'proposer';
    } else {
      this.role = 'challenger';
    }
  }

  public initializeAndDispute(expectedStates: State[], expectedFraud: boolean) {
    this.switchRole();
    let consensusWitness,
      disputedWitness: Proof = {witness: {root: 0}};
    for (let round = 0; round < 10; round++) {
      const disagreeWithIndex = this.firstDisputedIndex();
      const agreeWithStep = this.cm.stepForIndex(disagreeWithIndex - 1);
      const disagreeWithStep = this.cm.stepForIndex(disagreeWithIndex);

      let leaves = _.range(0, expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.numSplits))
        .map(leafIndex => stepForIndex(leafIndex, agreeWithStep, disagreeWithStep, this.numSplits))
        .map(step => this.myStates()[step]);
      leaves = leaves.slice(1);
      this.cm.split(
        this.cm.states[disagreeWithIndex - 1],
        leaves,
        this.cm.states[disagreeWithIndex],
        this.role
      );

      try {
        this.switchRole();

        const disagreeWithIndex = this.firstDisputedIndex();
        consensusWitness = {witness: this.cm.states[disagreeWithIndex - 1]};
        disputedWitness = {witness: this.cm.states[disagreeWithIndex]};
        this.cm.detectFraud(consensusWitness, disputedWitness);
        break;
      } catch (e) {
        if (e.message !== 'Can only detect fraud for sequential states') {
          throw e;
        }
      }
    }

    expect(this.cm.states).toMatchObject(expectedStates);
    expect(this.cm.detectFraud(consensusWitness as Proof, disputedWitness as Proof)).toBe(
      expectedFraud
    );
  }
}
