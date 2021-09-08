import _ from 'lodash';
import {ChallengeManager, State, stepForIndex} from './bisection';
import {Role} from './bisection.test';

class AutoDisputerAgent {
  constructor(
    public role: Role,
    public cm: ChallengeManager,
    public myStates: State[],
    public numSplits: number
  ) {}

  private splitStates(agreeWithStep: number, disagreeWithStep: number): State[] {
    const initialStates: State[] = [];

    for (let i = 0; i <= this.numSplits; i++) {
      const index = stepForIndex(i, agreeWithStep, disagreeWithStep, this.numSplits);
      initialStates.push(this.myStates[index]);
    }

    return initialStates;
  }

  public takeTurn(): boolean {
    if (this.cm.caller === this.role) {
      throw new Error(`It's not my turn!`);
    }
    const disagreeWithIndex = this.firstDisputedIndex();
    if (this.cm.interval() > 1) {
      const agreeWithStep = this.cm.stepForIndex(disagreeWithIndex - 1);
      const disagreeWithStep = this.cm.stepForIndex(disagreeWithIndex);

      let leaves = this.splitStates(agreeWithStep, disagreeWithStep);

      // We only want the leaves so we slice off the parent
      leaves = leaves.slice(1);

      this.cm.split(
        this.cm.states[disagreeWithIndex - 1],
        leaves,
        this.cm.states[disagreeWithIndex],
        this.role
      );

      return false;
    } else {
      const disagreeWithIndex = this.firstDisputedIndex();
      const consensusWitness = {witness: this.cm.states[disagreeWithIndex - 1]};
      const disputedWitness = {witness: this.cm.states[disagreeWithIndex]};

      return this.cm.detectFraud(consensusWitness, disputedWitness);
    }
  }

  private firstDisputedIndex(): number {
    for (let i = 0; i < this.cm.states.length; i++) {
      const step = this.cm.stepForIndex(i);
      if (this.cm.states[i].root !== this.myStates[step].root) {
        return i;
      }
    }
    throw 'Did not find disputed state';
  }
}
export class AutomaticDisputer {
  private cm: ChallengeManager;

  constructor(
    public numSplits: number,
    public challengerStates: State[],
    public proposerStates: State[]
  ) {
    const initialStates = [];
    for (let i = 0; i <= numSplits; i++) {
      const index = i === 0 ? 0 : stepForIndex(i, 0, proposerStates.length - 1, numSplits);
      initialStates.push(proposerStates[index]);
    }

    this.cm = new ChallengeManager(
      initialStates,
      state => ({root: state.root + 1}),
      state => state.root,
      'proposer',
      this.challengerStates.length - 1,
      this.numSplits
    );
  }

  private takeTurn(proposer: AutoDisputerAgent, challenger: AutoDisputerAgent): boolean {
    if (this.cm.caller === 'challenger') {
      return proposer.takeTurn();
    } else {
      return challenger.takeTurn();
    }
  }

  public initializeAndDispute(expectedStates: State[], expectedFraud: boolean) {
    const proposer = new AutoDisputerAgent(
      'proposer',
      this.cm,
      this.proposerStates,
      this.numSplits
    );
    const challenger = new AutoDisputerAgent(
      'challenger',
      this.cm,
      this.challengerStates,
      this.numSplits
    );
    let detectedFraud = false;
    while (this.cm.interval() > 1 && !detectedFraud) {
      this.takeTurn(proposer, challenger);
    }
    if (!detectedFraud) {
      detectedFraud = this.takeTurn(proposer, challenger);
    }

    expect(this.cm.states).toMatchObject(expectedStates);
    expect(detectedFraud).toBe(expectedFraud);
  }
}
