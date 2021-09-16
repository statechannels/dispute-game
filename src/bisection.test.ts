import {ChallengeManager, State, WitnessProof} from './bisection';
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
function state(values: number[], index: number): State {
  return {root: values[index]};
}
function fingerprints(values: number[], indices: number[]) {
  return states(values, indices).map(fingerprint);
}
function witness(values: number[], indices: number[], index: number): WitnessProof {
  return generateWitness(states(values, indices), index);
}
export const fingerprint = (state: State) => sha3_256(state.root.toString());

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

  const consensusWitness = witness(correctStates, [0, 3, 6, 9], 1);
  const disputeWitness = witness(correctStates, [0, 3, 6, 9], 2);
  cm.split(consensusWitness, fingerprints(incorrectStates, [4, 5, 6]), disputeWitness, proposerId);

  expect(
    cm.detectFraud(
      witness(incorrectStates, [4, 5, 6], 0),
      {root: 4},
      witness(incorrectStates, [4, 5, 6], 1)
    )
  ).toBe(true);
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
