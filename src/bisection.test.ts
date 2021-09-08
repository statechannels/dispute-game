import {ChallengeManager, expectedNumOfLeaves, State, stepForIndex} from './bisection';
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

  cm.split(state(incorrectStates, 4), states(incorrectStates, [6, 9]), proposerId);

  expect(() =>
    cm.split(state(incorrectStates, 9), states(correctStates, [9]), challengerId)
  ).toThrowError('Consensus witness cannot be the last stored state');
  expect(() =>
    cm.split(state(correctStates, 1), states(correctStates, [2, 9]), challengerId)
  ).toThrowError('Consensus witness is not in the stored states');

  cm.split(state(correctStates, 4), states(correctStates, [5, 6]), challengerId);
  expect(cm.detectFraud({witness: {root: 4}})).toBe(false);
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

  cm.split(state(incorrectStates, 3), states(incorrectStates, [4, 5, 6]), proposerId);
  expect(cm.detectFraud({witness: {root: 4}})).toBe(true);
});

class AutomaticDisputer {
  private cm: ChallengeManager;
  private role: Role = 'proposer';
  constructor(
    public numSplits: number = 2,
    public initialIndices: number[] = [0, 44, 89],
    public correctStates = _.range(100),
    public incorrectStates = _.concat(
      _.range(60),
      _.range(60, 90).map(i => i + 0.1)
    )
  ) {
    this.cm = new ChallengeManager(
      states(this.incorrectStates, initialIndices),
      state => ({root: state.root + 1}),
      state => state.root,
      this.role,
      89,
      this.numSplits
    );
  }
  private myStates(): State[] {
    const states = this.role === 'challenger' ? this.correctStates : this.incorrectStates;
    return states.map(state => ({
      root: state
    }));
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

  public initializeAndDispute(
    expectedStates = [{root: 58}, {root: 59}, {root: 60.1}],
    expectedFraud = true
  ) {
    this.switchRole();
    for (let round = 0; round < 10; round++) {
      const disagreeWithIndex = this.firstDisputedIndex();
      const agreeWithStep = this.cm.stepForIndex(disagreeWithIndex - 1);
      const disagreeWithStep = this.cm.stepForIndex(disagreeWithIndex);

      let leaves = _.range(0, expectedNumOfLeaves(agreeWithStep, disagreeWithStep, this.numSplits))
        .map(leafIndex => stepForIndex(leafIndex, agreeWithStep, disagreeWithStep, this.numSplits))
        .map(step => this.myStates()[step]);
      leaves = leaves.slice(1);
      this.cm.split(this.cm.states[disagreeWithIndex - 1], leaves, this.role);

      try {
        this.switchRole();

        const disagreeWithIndex = this.firstDisputedIndex();
        this.cm.detectFraud({witness: this.cm.states[disagreeWithIndex - 1]});
        break;
      } catch (e) {
        if (e.message !== 'Can only detect fraud for sequential states') {
          throw e;
        }
      }
    }

    expect(this.cm.states).toMatchObject(expectedStates);
    expect(this.cm.detectFraud({witness: {root: 59}})).toBe(expectedFraud);
  }
}

test('automatic bisection', () => {
  const ad = new AutomaticDisputer();
  ad.initializeAndDispute();
});

test('automatic trisection', () => {
  const ad = new AutomaticDisputer(3, [0, 29, 59, 89]);
  ad.initializeAndDispute([{root: 59}, {root: 60}, {root: 61}, {root: 62}], false);
});
