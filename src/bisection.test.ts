import {ChallengeManager, State} from './bisection';
import _ from 'lodash';
import {AutomaticDisputer} from './auto-disputer';
import {sha3_256} from 'js-sha3';
import {generateWitness} from './merkle';

export type Role = 'challenger' | 'proposer';
const challengerId = 'challenger' as const;
const proposerId = 'proposer' as const;
function states(values: number[], indices: number[]): State[] {
  return indices.map(step => ({root: values[step]}));
}

function fingerprints(values: number[], indices: number[]) {
  return states(values, indices).map(fingerprint);
}

export const fingerprint = (state: State) => sha3_256(state.root.toString());

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
    generateWitness(cm.stateHashes, 1),
    fingerprints(incorrectStates, [6, 9]),
    generateWitness(cm.stateHashes, 2),
    proposerId
  );

  expect(() =>
    cm.split(
      generateWitness(cm.stateHashes, 2),

      fingerprints(correctStates, [9]),
      generateWitness(cm.stateHashes, 2),
      challengerId
    )
  ).toThrowError('Consensus witness cannot be the last stored state');

  expect(() =>
    cm.split(
      generateWitness(fingerprints(correctStates, [5, 6, 7]), 1),
      fingerprints(correctStates, [2, 9]),
      generateWitness(cm.stateHashes, 2),
      challengerId
    )
  ).toThrowError('Invalid consensus witness proof');

  expect(() =>
    cm.split(
      generateWitness(fingerprints(incorrectStates, [4, 5, 6]), 0),
      fingerprints(correctStates, [5, 6]),
      generateWitness(cm.stateHashes, 2),
      challengerId
    )
  ).toThrowError('Invalid consensus witness proof');

  expect(() =>
    cm.split(
      generateWitness(cm.stateHashes, 1),
      fingerprints(correctStates, [5, 6]),
      generateWitness(fingerprints(correctStates, [0, 1, 2]), 2),
      challengerId
    )
  ).toThrowError('Invalid dispute witness proof');

  cm.split(
    generateWitness(cm.stateHashes, 0),
    fingerprints(correctStates, [5, 6]),
    generateWitness(cm.stateHashes, 1),
    challengerId
  );

  expect(
    cm.detectFraud(
      generateWitness(cm.stateHashes, 1),
      {root: 5},
      generateWitness(cm.stateHashes, 2)
    )
  ).toBe(false);
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

  const consensusWitness = generateWitness(cm.stateHashes, 1);
  const disputeWitness = generateWitness(cm.stateHashes, 2);

  cm.split(consensusWitness, fingerprints(incorrectStates, [4, 5, 7]), disputeWitness, proposerId);

  expect(
    cm.detectFraud(
      generateWitness(cm.stateHashes, 1),
      {root: 4},
      generateWitness(cm.stateHashes, 2)
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
