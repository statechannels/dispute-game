import {sha3_256} from 'js-sha3';
import _ from 'lodash';

import {generateRoot, generateWitness, validateWitness} from '../merkle';

describe('validateWitness checks', () => {
  test('it returns false  when the proof is invalid for the root', () => {
    const validHashes = ['a', 'b', 'c'].map(sha3_256);
    const invalidHashses = ['a', 'b', 'INVALID'].map(sha3_256);
    const invalidRoot = generateRoot(invalidHashses);
    const witnessProof = generateWitness(validHashes, 2);

    expect(validateWitness(witnessProof, invalidRoot)).toBe(false);
  });

  test('it returns true for a valid proof and root', () => {
    const depth = 6;
    const validHashes = _.range(Math.pow(2, depth)).map(i => sha3_256(i.toString()));
    const validRoot = generateRoot(validHashes);

    for (let index = 0; index < validHashes.length; index++) {
      const witnessProof = generateWitness(validHashes, index);
      expect(validateWitness(witnessProof, validRoot)).toBe(true);
    }
  });
});
