import {ethers} from 'hardhat';
import chai, {use} from 'chai';

import {generateWitness, hash} from '../../ts-prototype/merkle';
import _ from 'lodash';
import {solidity} from 'ethereum-waffle';
import {Contract} from 'ethers';

const {expect} = chai;

let merkleUtils: Contract;
let merkleTestWrapper: Contract;

// This allows us to use things like .to.be.revertedWith
use(solidity);

describe('Merkle Utils Contract', () => {
  beforeEach(async () => {
    merkleUtils = await (await ethers.getContractFactory('MerkleUtils')).deploy();
    merkleTestWrapper = await (
      await ethers.getContractFactory('MerkleTestWrapper', {
        libraries: {MerkleUtils: merkleUtils.address}
      })
    ).deploy();
  });

  it('it returns false  when the proof is invalid for the root', async () => {
    const validHashes = ['a', 'b', 'c'].map(hash);
    const invalidHashses = ['a', 'b', 'INVALID'].map(hash);
    const invalidRoot = await merkleTestWrapper.generateRoot(invalidHashses);

    const witnessProof = await generateWitness(validHashes, 2);

    const result = await merkleTestWrapper.validateWitness(witnessProof, invalidRoot);
    expect(result).to.eq(false);
  });

  it('it returns true for a valid proof and root', async () => {
    const maxElements = Math.pow(2, 5);

    for (let numElements = Math.pow(2, 3); numElements <= maxElements; numElements++) {
      const validHashes = _.range(numElements).map(num => hash(num.toString()));

      const validRoot = await merkleTestWrapper.generateRoot(validHashes);

      for (let index = 0; index < validHashes.length; index++) {
        const witnessProof = generateWitness(validHashes, 2);

        const result = await merkleTestWrapper.validateWitness(witnessProof, validRoot);
        expect(result).to.eq(true);
      }
    }
  });
});
