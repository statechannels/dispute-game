import _ from 'lodash';
import {sha3_256} from 'js-sha3';

import {ChallengeManager, State, stepForIndex} from '../challenge-manager';
import {AutomaticDisputer} from '../auto-disputer';
import {generateWitness} from '../merkle';

export type Role = 'challenger' | 'proposer';
const challengerId = 'challenger' as const;
const proposerId = 'proposer' as const;

const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function states(values: number[], indices: number[]): State[] {
  return indices.map(step => ({root: values[step]}));
}

function fingerprints(values: number[], indices: number[]) {
  return states(values, indices).map(fingerprint);
}

export const fingerprint = (state: State): string => sha3_256(state.root.toString());

/**
 * Utilities tests
 */
describe('stepForIndex tests', () => {
  () =>
    test('Index is negative', () => {
      expect(() => {
        stepForIndex(-1, 0, 10, 2);
      }).toThrow('Invalid index');
    });

  test('Index is too large', () => {
    expect(() => {
      stepForIndex(4, 0, 10, 2);
    }).toThrow('Invalid index');
  });

  test('Index is too large', () => {
    expect(stepForIndex(1, 0, 9, 2)).toEqual(4);
  });
});

/**
 * End of utilities tests
 */

test('Invalid ChallengeManager instanatiation', () => {
  expect(() => {
    new ChallengeManager(
      fingerprints(correctStates, [0, 3, 4, 9]),
      state => ({root: state.root + 1}),
      fingerprint,
      challengerId,
      9,
      2
    );
  }).toThrow('Expected 3 number of states, recieved 4');
});

/**
 * This test case:
 * - Manually playes the dispute game with the split interval of 2
 * - Tests invalid inputs
 */
test('manual bisection', () => {
  const cm = new ChallengeManager(
    fingerprints(correctStates, [0, 4, 9]),
    state => ({root: state.root + 1}),
    fingerprint,
    challengerId,
    9,
    2
  );

  // Valid split 1
  cm.split(
    generateWitness(cm.lastCalldata, 1),
    fingerprints(incorrectStates, [6, 9]),
    generateWitness(cm.lastCalldata, 2),
    proposerId
  );

  // Test invalid inputs
  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 2),
      fingerprints(correctStates, [9]),
      generateWitness(cm.lastCalldata, 2),
      challengerId
    )
  ).toThrowError('Consensus witness cannot be the last stored state');

  expect(() =>
    cm.split(
      generateWitness(fingerprints(correctStates, [5, 6, 7]), 1),
      fingerprints(correctStates, [2, 9]),
      generateWitness(cm.lastCalldata, 2),
      challengerId
    )
  ).toThrowError('Invalid consensus witness proof');

  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 1),
      fingerprints(correctStates, [5, 6]),
      generateWitness(fingerprints(correctStates, [0, 1, 2]), 2),
      challengerId
    )
  ).toThrowError('Invalid dispute witness proof');

  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 0),
      fingerprints(correctStates, [5, 6]),
      generateWitness(cm.lastCalldata, 2),
      challengerId
    )
  ).toThrowError('Disputed state hash must be the next leaf after consensus state hash');

  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 0),
      fingerprints(incorrectStates, [5, 6]),
      generateWitness(cm.lastCalldata, 1),
      challengerId
    )
  ).toThrowError('The last state supplied must differ from the disputed witness');

  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 0),
      fingerprints(correctStates, [5, 6, 7]),
      generateWitness(cm.lastCalldata, 1),
      challengerId
    )
  ).toThrowError('Expected 2 number of states, recieved 3');

  // Valid split 2
  cm.split(
    generateWitness(cm.lastCalldata, 0),
    fingerprints(correctStates, [5, 6]),
    generateWitness(cm.lastCalldata, 1),
    challengerId
  );

  expect(() =>
    cm.split(
      generateWitness(cm.lastCalldata, 0),
      fingerprints(correctStates, [5, 6]),
      generateWitness(cm.lastCalldata, 1),
      challengerId
    )
  ).toThrowError('States cannot be split further');

  expect(
    cm.detectFraud(
      generateWitness(cm.lastCalldata, 1),
      {root: 5},
      generateWitness(cm.lastCalldata, 2)
    )
  ).toBe(false);
});

test('manual tri-section', () => {
  const cm = new ChallengeManager(
    fingerprints(correctStates, [0, 3, 6, 9]),
    state => ({root: state.root + 1}),
    fingerprint,
    challengerId,
    9,
    3
  );

  const consensusWitness = generateWitness(cm.lastCalldata, 1);
  const disputeWitness = generateWitness(cm.lastCalldata, 2);

  cm.split(consensusWitness, fingerprints(incorrectStates, [4, 5, 7]), disputeWitness, proposerId);

  expect(
    cm.detectFraud(
      generateWitness(cm.lastCalldata, 1),
      {root: 4},
      generateWitness(cm.lastCalldata, 2)
    )
  ).toBe(true);
});

const amountOfStates = 25;
const maxSplits = 25;

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
