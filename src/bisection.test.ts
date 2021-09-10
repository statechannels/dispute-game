import {ChallengeManager, State} from './bisection';
import _ from 'lodash';
import {AutomaticDisputer} from './auto-disputer';

export type Role = 'challenger' | 'proposer';
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

const amountOfStates = 90;
const maxSplits = 90;

test('Fuzzy testing', () => {
  for (let errorIndex = 1; errorIndex < amountOfStates; errorIndex++) {
    for (let splitNum = 2; splitNum < maxSplits; splitNum++) {
      const correctStates = _.range(amountOfStates).map(root => ({root}));
      const incorrectStates = _.concat(
        _.range(errorIndex),
        _.range(errorIndex, amountOfStates).map(i => i + 0.1)
      ).map(root => ({root}));

      try {
        const ad = new AutomaticDisputer(splitNum, correctStates, incorrectStates);
        const {detectedFraud, states} = ad.runDispute();
        if (ad.caller === 'proposer') {
          expect(detectedFraud).toBe(true);
          expect(states);
        } else {
          expect(detectedFraud).toBe(false);
        }
      } catch (error) {
        console.error(`Failed with splitNum ${splitNum} and error starting at index ${errorIndex}`);
        throw error;
      }
    }
  }
});
