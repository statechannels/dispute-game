import {ChallengeManager, State, Witness} from './bisection';
import _ from 'lodash';
import {AutomaticDisputer} from './auto-disputer';
import {sha3_256} from 'js-sha3';

export type Role = 'challenger' | 'proposer';
const challengerId = 'challenger' as const;
const proposerId = 'proposer' as const;

function states(values: number[], indices: number[]): State[] {
  return indices.map(step => ({root: values[step]}));
}

function state(values: number[], index: number): State {
  return {root: values[index]};
}

export const fingerprint = (state: State) => sha3_256(state.root.toString());

function fingerprints(values: number[], indices: number[]) {
  return states(values, indices).map(fingerprint);
}

function witness(values: number[], index: number): Witness {
  return {witness: fingerprint(state(values, index))};
}

test('manual bisection', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    fingerprints(correctStates, [0, 4, 9]),
    state => ({root: state.root + 1}),
    fingerprint,
    challengerId,
    9,
    2
  );

  cm.split(
    witness(incorrectStates, 4),
    fingerprints(incorrectStates, [6, 9]),
    witness(correctStates, 9),
    proposerId
  );

  expect(() =>
    cm.split(
      witness(incorrectStates, 9),
      fingerprints(correctStates, [9]),
      witness(incorrectStates, 9),
      challengerId
    )
  ).toThrowError('Consensus witness cannot be the last stored state');

  expect(() =>
    cm.split(
      witness(correctStates, 1),
      fingerprints(correctStates, [2, 9]),
      witness(incorrectStates, 9),
      challengerId
    )
  ).toThrowError('Consensus witness is not in the stored states');

  expect(() =>
    cm.split(
      witness(correctStates, 4),
      fingerprints(correctStates, [5, 6]),
      witness(correctStates, 6),
      challengerId
    )
  ).toThrowError('Disputed witness does not match');

  cm.split(
    witness(correctStates, 4),
    fingerprints(correctStates, [5, 6]),
    witness(incorrectStates, 6),
    challengerId
  );
  expect(cm.detectFraud(witness(correctStates, 5), {root: 5}, witness(correctStates, 6))).toBe(
    false
  );
});

test('manual tri-section', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    fingerprints(correctStates, [0, 3, 6, 9]),
    state => ({root: state.root + 1}),
    fingerprint,
    challengerId,
    9,
    3
  );

  cm.split(
    witness(incorrectStates, 3),
    fingerprints(incorrectStates, [4, 5, 6]),
    witness(correctStates, 6),
    proposerId
  );
  expect(cm.detectFraud(witness(incorrectStates, 4), {root: 4}, witness(incorrectStates, 5))).toBe(
    true
  );
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
        // TODO: We should check that the states contain the state at errorIndex
        const {detectedFraud} = ad.runDispute();
        if (ad.caller === 'proposer') {
          expect(detectedFraud).toBe(true);
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
