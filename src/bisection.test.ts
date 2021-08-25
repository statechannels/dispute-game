import {ChallengeManager, StepCommitment} from './bisection';
import _ from 'lodash';

function commitment(states: number[], indices: number[]): StepCommitment[] {
  return indices.map(step => ({root: states[step], step}));
}

test('manual bisection', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const cm = new ChallengeManager(
    commitment(incorrectStates, [0, 9]),
    state => ({root: state.root + 1}),
    state => state.root
  );

  cm.split({commitment: 0});
  expect(cm.challenge).toEqual({commitment: 0});

  cm.commit(commitment(incorrectStates, [0, 4, 9]));

  cm.split({commitment: 1});

  expect(() => cm.commit(commitment(incorrectStates, [4, 7, 9]))).toThrowError('invalid indices');

  expect(() => cm.commit(commitment(incorrectStates, [4, 9]))).toThrowError(
    'invalid commitment length'
  );

  expect(() => cm.commit(commitment(incorrectStates, [0, 2, 4]))).toThrowError(
    'first commitment is invalid'
  );

  expect(() => cm.commit(commitment(incorrectStates, [4, 6, 8]))).toThrowError(
    'last commitment is invalid'
  );

  cm.commit(commitment(incorrectStates, [4, 6, 9]));

  expect(() => cm.detectFraud({witness: {root: 4}, startingAt: 0})).toThrow('out of gas');

  cm.split({commitment: 0});
  cm.commit(commitment(incorrectStates, [4, 5, 6]));

  expect(cm.detectFraud({witness: {root: 4}, startingAt: 0})).toBe(true);
});

test('automatic bisection', () => {
  const correctStates = _.range(100);
  const incorrectStates = _.concat(
    _.range(60),
    _.range(60, 90).map(i => i + 0.1)
  );
  const cm = new ChallengeManager(
    commitment(incorrectStates, [0, 49, 99]),
    state => ({root: state.root + 1}),
    state => state.root
  );

  const validatedSteps: StepCommitment[] = correctStates.map(step => ({root: step, step}));

  function lastCorrectCommitment() {
    let i = 0;
    while (true) {
      const committedStep = cm.commitments[i];
      const correctRoot = validatedSteps[committedStep.step].root;
      if (committedStep.root == correctRoot) {
        i += 1;
      } else {
        return i - 1;
      }
    }
  }

  let round;
  for (round = 0; round < 10; round++) {
    // the verifier posts the last correct commitment
    const idx = lastCorrectCommitment();
    const lastCorrectStep = cm.commitments[idx];
    try {
      cm.detectFraud({witness: {root: lastCorrectStep.root}, startingAt: idx}, 200);
      break;
    } catch (e) {
      if (e.message == 'out of gas') {
        cm.split({commitment: idx});
      } else {
        throw e;
      }
    }

    // the sequencer bisects
    const first = cm.commitments[cm.challenge.commitment];
    const last = cm.commitments[cm.challenge.commitment + 1];
    const step = Math.floor((first.step + last.step) / 2);
    const middle = {root: incorrectStates[step], step};
    cm.commit([first, middle, last]);
  }
  expect(round).toEqual(4);
  expect(cm.commitments).toMatchObject([
    {root: 55, step: 55},
    {root: 58, step: 58},
    {root: 61.1, step: 61}
  ]);
  expect(cm.detectFraud({witness: {root: 58}, startingAt: 1})).toBeTruthy();
});
