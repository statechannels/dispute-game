import {
  ChallengeManager,
  expectedNumOfLeaves,
  interval,
  Proof,
  State,
  stepForIndex
} from './bisection';
import _ from 'lodash';

type Role = 'challenger' | 'proposer';
const challengerId = 'challenger' as const;
const proposerId = 'proposer' as const;

function states(states: number[], indices: number[]): State[] {
  return indices.map(step => ({root: states[step]}));
}

function state(states: number[], index: number): State {
  return {root: states[index]};
}

test('manual bisection', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    states(correctStates, [0, 4, 9]),
    state => ({root: state.root + 1}),
    state => state.root,
    challengerId,
    9,
    2
  );

  cm.split(
    state(incorrectStates, 4),
    states(incorrectStates, [6, 9]),
    state(correctStates, 9),
    proposerId
  );

  expect(() =>
    cm.split(
      state(incorrectStates, 9),
      states(correctStates, [9]),
      state(incorrectStates, 9),
      challengerId
    )
  ).toThrowError('Consensus witness cannot be the last stored state');

  expect(() =>
    cm.split(
      state(correctStates, 1),
      states(correctStates, [2, 9]),
      state(incorrectStates, 9),
      challengerId
    )
  ).toThrowError('Consensus witness is not in the stored states');

  expect(() =>
    cm.split(
      state(correctStates, 4),
      states(correctStates, [5, 6]),
      state(correctStates, 6),
      challengerId
    )
  ).toThrowError('Disputed witness does not match');

  cm.split(
    state(correctStates, 4),
    states(correctStates, [5, 6]),
    state(incorrectStates, 6),
    challengerId
  );
  expect(cm.detectFraud({witness: {root: 4}}, {witness: {root: 5}})).toBe(false);
});

test('manual tri-section', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    states(correctStates, [0, 3, 6, 9]),
    state => ({root: state.root + 1}),
    state => state.root,
    challengerId,
    9,
    3
  );

  cm.split(
    state(incorrectStates, 3),
    states(incorrectStates, [4, 5, 6]),
    state(correctStates, 6),
    proposerId
  );
  expect(cm.detectFraud({witness: {root: 4}}, {witness: {root: 5.1}})).toBe(true);
});

class AutomaticDisputer {
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

test('automatic bisection', () => {
  const correctStates = _.range(90).map(root => ({root}));
  const incorrectStates = _.concat(
    _.range(60),
    _.range(60, 90).map(i => i + 0.1)
  ).map(root => ({root}));
  const ad = new AutomaticDisputer(2, correctStates, incorrectStates);
  ad.initializeAndDispute([{root: 58}, {root: 59}, {root: 60.1}], true);
});

test('automatic trisection', () => {
  const correctStates = _.range(90).map(root => ({root}));
  const incorrectStates = _.concat(
    _.range(60),
    _.range(60, 90).map(i => i + 0.1)
  ).map(root => ({root}));
  const ad = new AutomaticDisputer(3, correctStates, incorrectStates);
  ad.initializeAndDispute([{root: 59}, {root: 60}, {root: 61}, {root: 62}], false);
});
