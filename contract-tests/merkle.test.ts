import {ethers, waffle} from 'hardhat';
import chai from 'chai';

import DisputeGameManagerArtifact from '../artifacts/contracts/dispute-game-manager.sol/DisputeGameManager.json';
import {DisputeGameManager} from '../src/contract-types/DisputeGameManager';
import {State} from '../src/challenge-manager';
import {sha3_256} from 'js-sha3';
import {generateRoot, Hash} from '../src/merkle';
import _ from 'lodash';
import {MerkleHelper} from '../src/contract-types';

function states(values: number[], indices: number[]): State[] {
  return indices.map(step => ({root: values[step]}));
}

function fingerprints(values: number[], indices: number[]): Hash[] {
  return states(values, indices).map(fingerprint);
}

const fingerprint = (state: State): string => `0x${sha3_256(state.root.toString())}`;

const {deployContract} = waffle;
const {expect} = chai;

describe('Merkle Helpers', () => {
  it('generates a root', async () => {
    // bytes32[] memory _hashes,
    // uint256 _disputedStep,
    // string memory _caller,
    // uint256 _numOfSplits

    const merkleHelper = await (await ethers.getContractFactory('MerkleHelper')).deploy();
    const merkleWrapper = await (
      await ethers.getContractFactory('MerkleWrapper', {
        libraries: {MerkleHelper: merkleHelper.address}
      })
    ).deploy();
    const depth = 6;
    const validHashes = _.range(Math.pow(2, depth)).map(i => `0x${sha3_256(i.toString())}`);
    const contractRoot = await merkleWrapper.generateRoot(validHashes);

    const proof = {witness: validHashes[0], index: 0, nodes: validHashes};

    const validateResult = await merkleWrapper.validateWitness(proof, contractRoot);

    // const typeScriptRoot = `0x${generateRoot(validHashes.map(h => h.slice(-2)))}`;

    expect(validateResult).to.eq(true);
  });
});
