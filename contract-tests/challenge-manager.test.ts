import {ethers} from 'hardhat';
import {ChallengeManager} from '..//src/contract-types/ChallengeManager';
import {expect} from 'chai';
import {generateWitness, hash} from '../src/merkle';
import _ from 'lodash';

function getElements(array: string[], indices: number[]): string[] {
  return indices.map(i => array[i]);
}

enum ChallengeStatus {
  InProgress = 0,
  FraudDetected = 1,
  Forfeited = 2
}

describe('Challenge Manager Contract', () => {
  let manager: ChallengeManager;

  it('can perform a basic bisection', async () => {
    const merkleUtils = await (await ethers.getContractFactory('MerkleUtils')).deploy();

    const factory = await ethers.getContractFactory('ChallengeManager', {
      libraries: {MerkleUtils: merkleUtils.address}
    });

    const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const correctHashes = correctStates.map(num => hash(num.toString()));
    const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
    const incorrectHashes = incorrectStates.map(num => hash(num.toString()));

    manager = await factory.deploy(getElements(correctHashes, [0, 4, 9]), 9, 'challenger', 2);
    let status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.InProgress);
    await manager.split(
      generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
      getElements(incorrectHashes, [6, 9]),
      generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
      'proposer'
    );

    await manager.split(
      generateWitness(getElements(incorrectHashes, [4, 6, 9]), 1),
      getElements(correctHashes, [5, 6]),
      generateWitness(getElements(incorrectHashes, [4, 6, 9]), 2),
      'challenger'
    );

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
        getElements(incorrectHashes, [6, 9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.be.revertedWith('States cannot be split further');

    await manager.fraudDetected(1);
    status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.FraudDetected);
  });
});
