import {ethers, waffle} from 'hardhat';
import chai from 'chai';

import DisputeGameManagerArtifact from '../artifacts/contracts/dispute-game-manager.sol/DisputeGameManager.json';
import {DisputeGameManager} from '../src/contract-types/DisputeGameManager';
import {State} from '../src/challenge-manager';
import {sha3_256} from 'js-sha3';
import {Hash} from '../src/merkle';

function states(values: number[], indices: number[]): State[] {
  return indices.map(step => ({root: values[step]}));
}

function fingerprints(values: number[], indices: number[]): Hash[] {
  return states(values, indices).map(fingerprint);
}

const fingerprint = (state: State): string => `0x${sha3_256(state.root.toString())}`;

const {deployContract} = waffle;
const {expect} = chai;

describe('Dispute Game Contract', () => {
  let manager: DisputeGameManager;
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  it('inits', async () => {
    // bytes32[] memory _hashes,
    // uint256 _disputedStep,
    // string memory _caller,
    // uint256 _numOfSplits

    const merkleHelper = await (await ethers.getContractFactory('MerkleHelper')).deploy();
    const indexMath = await (await ethers.getContractFactory('IndexMath')).deploy();
    const factory = await ethers.getContractFactory('DisputeGameManager', {
      libraries: {MerkleHelper: merkleHelper.address, IndexMath: indexMath.address}
    });
    console.log(fingerprints(correctStates, [0, 4, 9]));
    const manager = await factory.deploy(
      fingerprints(correctStates, [0, 4, 9]),
      9,
      'challenger',
      2,
      {}
    );

    const interval = await manager.interval();
    expect(interval.eq(4));
  });
});
