import {BigNumberish, BytesLike} from 'ethers';
import {DisputeAgent} from '.';

import {ChainContext, DisputeManagerInterface} from './dispute-agent';
import {State} from './dispute-manager';
import {hash, Hash} from './merkle';

export class MockChainContext implements ChainContext {
  deploy(
    hashes: Hash[],
    numSteps: BigNumberish,
    lastMover: string,
    splitFactor: BigNumberish
  ): Promise<void> {}
}

export class DisputeGame {
  public static async create(
    numSplits: number,
    challengerStates: State[],
    proposerStates: State[],
    chainContext: ChainContext
  ): Promise<DisputeGame> {
    const proposer = await DisputeAgent.create(
      'proposer',
      proposerStates.map(s => hash(s.root.toString())),
      numSplits,
      chainContext
    );
    const challenger = await DisputeAgent.create(
      'challenger',
      challengerStates.map(s => hash(s.root.toString())),
      numSplits,
      chainContext
    );
    return new DisputeGame(numSplits, challenger, proposer, chainContext);
  }
  constructor(
    numSplits: number,
    private challenger: DisputeAgent,
    private proposer: DisputeAgent,
    private chainContext: ChainContext
  ) {}

  private async getActor(): Promise<DisputeAgent> {
    const lastMover = await this.chainContext.disputeManager.lastMover();
    if (lastMover === 'challenger') {
      return this.proposer;
    }
    return this.challenger;
  }

  public async getLastMover(): Promise<string> {
    return this.chainContext.disputeManager.lastMover();
  }
}
