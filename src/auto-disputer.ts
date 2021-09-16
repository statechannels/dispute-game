import _ from 'lodash';
import MerkleTree from 'merkle-tools';
import {ChallengeManager, expectedNumOfLeaves, State, stepForIndex} from './bisection';
import {fingerprint, Role} from './bisection.test';
import {generateWitness, Hash} from './merkle';

class AutoDisputerAgent {
  constructor(
    public role: Role,
    public cm: ChallengeManager,
    public myStates: State[],
    public numSplits: number
  ) {}

  private splitStates(agreeWithStep: number, disagreeWithStep: number): State[] {
    const initialStates: State[] = [];

    for (let i = 0; i < expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.numSplits); i++) {
      const index = stepForIndex(i, agreeWithStep, disagreeWithStep, this.numSplits);
      initialStates.push(this.myStates[index]);
    }

    return initialStates;
  }

  public takeTurn(): {complete: boolean; detectedFraud: boolean} {
    if (this.cm.caller === this.role) {
      throw new Error(`It's not my turn!`);
    }
    const disagreeWithIndex = this.firstDisputedIndex();
    const agreeWithStep = this.cm.stepForIndex(disagreeWithIndex - 1);
    const disagreeWithStep = this.cm.stepForIndex(disagreeWithIndex);
    const consensusWitness = generateWitness(this.cm.stateHashes, disagreeWithIndex - 1);
    const disputedWitness = generateWitness(this.cm.stateHashes, disagreeWithIndex);
    if (this.cm.interval() > 1) {
      let leaves = this.splitStates(agreeWithStep, disagreeWithStep);

      // We only want the leaves so we slice off the parent
      leaves = leaves.slice(1);

      this.cm.split(consensusWitness, leaves.map(fingerprint), disputedWitness, this.role);

      return {complete: false, detectedFraud: false};
    } else {
      const disagreeWithIndex = this.firstDisputedIndex();

      const consensusWitness = generateWitness(this.cm.stateHashes, disagreeWithIndex - 1);
      const disputedWitness = generateWitness(this.cm.stateHashes, disagreeWithIndex);
      const detectedFraud =
        this.cm.interval() <= 1
          ? this.cm.detectFraud(
              consensusWitness,
              this.myStates[this.cm.stepForIndex(disagreeWithIndex - 1)],
              disputedWitness
            )
          : false;
      return {complete: true, detectedFraud};
    }
  }

  private firstDisputedIndex(): number {
    for (let i = 0; i < this.cm.stateHashes.length; i++) {
      const step = this.cm.stepForIndex(i);
      if (this.cm.stateHashes[i] !== fingerprint(this.myStates[step])) {
        return i;
      }
    }
    throw 'Did not find disputed state';
  }
}

export class AutomaticDisputer {
  private cm: ChallengeManager;
  challenger: AutoDisputerAgent;
  proposer: AutoDisputerAgent;

  constructor(
    public numSplits: number,
    public challengerStates: State[],
    public proposerStates: State[]
  ) {
    const initialStates = [];
    for (let i = 0; i < expectedNumOfLeaves(0, proposerStates.length - 1, numSplits); i++) {
      const index = i === 0 ? 0 : stepForIndex(i, 0, proposerStates.length - 1, numSplits);
      initialStates.push(proposerStates[index]);
    }

    this.cm = new ChallengeManager(
      initialStates.map(fingerprint),
      state => ({root: state.root + 1}),
      fingerprint,
      'proposer',
      this.challengerStates.length - 1,
      this.numSplits
    );

    this.proposer = new AutoDisputerAgent('proposer', this.cm, this.proposerStates, this.numSplits);
    this.challenger = new AutoDisputerAgent(
      'challenger',
      this.cm,
      this.challengerStates,
      this.numSplits
    );
  }

  private takeTurn(): {complete: boolean; detectedFraud: boolean} {
    if (this.cm.caller === 'challenger') {
      return this.proposer.takeTurn();
    } else {
      return this.challenger.takeTurn();
    }
  }

  public get caller() {
    return this.cm.caller;
  }

  public runDispute(): {detectedFraud: boolean; states: Hash[]} {
    let isComplete = false;
    let detectedFraud = false;
    while (!isComplete) {
      const result = this.takeTurn();
      isComplete = result.complete;
      detectedFraud = result.detectedFraud;
    }

    return {detectedFraud, states: this.cm.stateHashes};
  }
}
