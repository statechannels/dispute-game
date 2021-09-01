import {ChallengeManager, StepCommitment} from './bisection';
import _ from 'lodash';

const challengerId = 'challenger';
const proposerId = 'proposer';

function commitment(states: number[], indices: number[]): StepCommitment[] {
  return indices.map(step => ({root: states[step], step}));
}

test('manual bisection', () => {
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    commitment(correctStates, [0, 9]),
    state => ({root: state.root + 1}),
    state => state.root,
    challengerId
  );

  cm.split(commitment(incorrectStates, [4]), proposerId);
  expect(() => cm.split(commitment(correctStates, [5]), challengerId)).toThrowError(
    'Invalid indices'
  );
  expect(() => cm.split(commitment(correctStates, [9]), challengerId)).toThrowError(
    'The first commitment step is too large'
  );

  cm.split(commitment(correctStates, [6]), challengerId);
  const gasLimit = 5;
  expect(() => cm.detectFraud({witness: {root: 4}, startingAt: 0}, gasLimit)).toThrow('out of gas');
  cm.split(commitment(incorrectStates, [5]), proposerId);

  expect(cm.detectFraud({witness: {root: 4}, startingAt: 0})).toBe(true);
});

test('manual tri-section', () => {
  const challengerId = 'challenger';
  const proposerId = 'proposer';
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cm = new ChallengeManager(
    commitment(correctStates, [0, 9]),
    state => ({root: state.root + 1}),
    state => state.root,
    challengerId
  );

  cm.split(commitment(incorrectStates, [3, 6]), proposerId);
  cm.split(commitment(correctStates, [4, 5]), challengerId);
  expect(cm.detectFraud({witness: {root: 4}, startingAt: 0})).toBe(false);
});

test('automatic bisection', () => {
  const correctStates = _.range(100);
  const incorrectStates = _.concat(
    _.range(60),
    _.range(60, 90).map(i => i + 0.1)
  );
  const cm = new ChallengeManager(
    commitment(incorrectStates, [0, 49, 89]),
    state => ({root: state.root + 1}),
    state => state.root
  );

  const validatedSteps: StepCommitment[] = correctStates.map(step => ({root: step, step}));

  function firstIncorrectStep() {
    let i = 0;
    while (true) {
      const committedStep = cm.commitments[i];
      const correctRoot = validatedSteps[committedStep.step].root;
      if (committedStep.root == correctRoot) {
        i += 1;
      } else {
        return i;
      }
    }
  }

  let round;
  for (round = 0; round < 10; round++) {
    // the verifier posts the last correct commitment
    const idx = firstIncorrectStep();
    const lastCorrectStep = cm.commitments[idx - 1];
    try {
      expect(
        cm.detectFraud({witness: {root: lastCorrectStep.root}, startingAt: idx - 1}, 200)
      ).toBeTruthy();
      break;
    } catch (e) {
      if (e.message == 'out of gas') {
        cm.assertInvalidStep(idx);
      } else {
        throw e;
      }
    }

    // the sequencer bisects
    const first = cm.commitments[cm.incorrectStepIndex - 1];
    const last = cm.commitments[cm.incorrectStepIndex];
    const step = Math.floor((first.step + last.step) / 2);
    const middle = {root: incorrectStates[step], step};
    cm.split([first, middle, last]);
  }

  // expect(round).toEqual(4);
  expect(cm.commitments).toMatchObject([
    {root: 59, step: 59},
    {root: 61.1, step: 61},
    {root: 64.1, step: 64}
  ]);
  expect(cm.detectFraud({witness: {root: 59}, startingAt: 0}, 200)).toBeTruthy();
});
