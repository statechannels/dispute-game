import {ethers} from 'hardhat';

import {expect, use} from 'chai';
import {generateWitness, hash, WitnessProof} from '../src/merkle';
import _ from 'lodash';
import {Contract, ContractFactory} from '@ethersproject/contracts';
import {solidity} from 'ethereum-waffle';

function getElements(array: string[], indices: number[]): string[] {
  return indices.map(i => array[i]);
}

enum ChallengeStatus {
  InProgress = 0,
  FraudDetected = 1,
  Forfeited = 2
}

// This allows us to use things like .to.be.revertedWith
use(solidity);

describe('Challenge Manager Contract', () => {
  let merkleUtils: Contract;
  let challengeManagerFactory: ContractFactory;
  const correctStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const correctHashes = correctStates.map(num => hash(num.toString()));
  const incorrectStates = [0, 1, 2, 3, 4, 5.1, 6.1, 7.1, 8.1, 9.1];
  const incorrectHashes = incorrectStates.map(num => hash(num.toString()));

  beforeEach(async () => {
    merkleUtils = await (await ethers.getContractFactory('MerkleUtils')).deploy();

    challengeManagerFactory = await ethers.getContractFactory('ChallengeManager', {
      libraries: {MerkleUtils: merkleUtils.address}
    });
  });

  it('can perform a basic bisection', async () => {
    const manager = await challengeManagerFactory.deploy(
      getElements(correctHashes, [0, 4, 9]),
      9,
      'challenger',
      2
    );
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

    await manager.claimFraud(1, 'proposer');
    status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.FraudDetected);

    const fraudIndex = await manager.fraudIndex();
    expect(fraudIndex).to.eq(1);
  });

  it('can perform a basic trisection', async () => {
    const manager = await challengeManagerFactory.deploy(
      getElements(correctHashes, [0, 3, 6, 9]),
      9,
      'challenger',
      3
    );
    let status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.InProgress);
    await manager.split(
      generateWitness(getElements(correctHashes, [0, 3, 6, 9]), 1),
      getElements(incorrectHashes, [4, 5, 7]),
      generateWitness(getElements(correctHashes, [0, 3, 6, 9]), 2),
      'proposer'
    );

    await manager.claimFraud(1, 'challenger');
    status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.FraudDetected);

    const fraudIndex = await manager.fraudIndex();
    expect(fraudIndex).to.eq(1);
  });

  it('Invalid ChallengeManager instanatiation', async () => {
    expect(
      challengeManagerFactory.deploy(getElements(correctHashes, [0, 3, 4, 9]), 9, 'challenger', 2)
    ).to.revertedWith('There must be k+1 values');

    expect(
      challengeManagerFactory.deploy(getElements(correctHashes, [0, 5, 9]), 9, 'challenger', 1)
    ).to.revertedWith('The splitting factor must be above 1');
  });

  it('Invalid splits, invalid detect fraud', async () => {
    const manager = await challengeManagerFactory.deploy(
      getElements(correctHashes, [0, 4, 9]),
      9,
      'challenger',
      2
    );

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        getElements(correctHashes, [9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('Consensus witness cannot be the last stored state');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        getElements(correctHashes, [9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'challenger'
      )
    ).to.revertedWith('The mover cannot be the same as the last mover');

    const leafWintness = generateWitness(getElements(correctHashes, [0, 4, 9]), 0);
    const lastNode = leafWintness.nodes.pop() as string;
    const nonLeafWitness: WitnessProof = {witness: lastNode, nodes: leafWintness.nodes, index: 0};

    await expect(
      manager.split(
        nonLeafWitness,
        getElements(correctHashes, [9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('The witness provided is not for a leaf node');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [5, 6, 7]), 1),
        getElements(correctHashes, [2, 4]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('Invalid consensus witness proof');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
        getElements(correctHashes, [2, 4]),
        generateWitness(getElements(correctHashes, [5, 6, 7]), 2),
        'proposer'
      )
    ).to.revertedWith('Invalid dispute witness proof');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 0),
        getElements(correctHashes, [2, 4]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('Disputed state hash must be the next leaf after consensus state hash');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
        getElements(correctHashes, [6, 9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('The last state supplied must differ from the disputed witness');

    await expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 0),
        getElements(correctHashes, [2, 3, 5]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
        'proposer'
      )
    ).to.revertedWith('Incorrect amount of state hashes');

    await expect(manager.claimFraud(1, 'challenger')).to.revertedWith(
      'The mover cannot be the same as the last mover'
    );
  });
  it('forfeits', async () => {
    const manager = await challengeManagerFactory.deploy(
      getElements(correctHashes, [0, 4, 9]),
      9,
      'challenger',
      2
    );
    let status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.InProgress);

    await manager.forfeit('proposer');
    status = await manager.currentStatus();
    expect(status).to.eq(ChallengeStatus.Forfeited);
    expect(
      manager.split(
        generateWitness(getElements(correctHashes, [0, 4, 9]), 1),
        getElements(incorrectHashes, [6, 9]),
        generateWitness(getElements(correctHashes, [0, 4, 9]), 2),
        'proposer'
      )
    ).to.revertedWith('The challenge is already complete');
  });
});
