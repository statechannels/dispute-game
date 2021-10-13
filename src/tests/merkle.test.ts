import {ethers} from 'ethers';

import _ from 'lodash';

import {generateRoot, generateWitness, validateWitness} from '../merkle';

describe('validateWitness checks', () => {
  test('it returns false  when the proof is invalid for the root', () => {
    const validHashes = ['a', 'b', 'c'].map(val => ethers.utils.keccak256(ethers.utils.id(val)));
    const invalidHashses = ['a', 'b', 'INVALID'].map(val =>
      ethers.utils.keccak256(ethers.utils.id(val))
    );
    const invalidRoot = generateRoot(invalidHashses);
    const witnessProof = generateWitness(validHashes, 2);

    expect(validateWitness(witnessProof, invalidRoot)).toBe(false);
  });

  test('it returns true for a valid proof and root', () => {
    const depth = 6;
    const validHashes = _.range(Math.pow(2, depth)).map(i =>
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(i.toString()))
    );

    const validRoot = generateRoot(validHashes);

    for (let index = 0; index < validHashes.length; index++) {
      const witnessProof = generateWitness(validHashes, index);
      expect(validateWitness(witnessProof, validRoot)).toBe(true);
    }
  });
});
