import {DisputeManager, ChallengerAgent} from '.';
import {State} from './dispute-manager';
import {Hash} from './merkle';

/**
 * Global context is the chain state.
 */
export class GlobalContext {
  /**
   * The DisputeManager mimics the on-chain contract.
   * It can be 'deployed' and its state can be inspected.
   */
  public disputeManager: DisputeManager | null = null;
  public deployDisputeManager(cm: DisputeManager): void {
    this.disputeManager = cm;
  }

  public getValidDisputeManager(): DisputeManager {
    if (!this.disputeManager) {
      throw new Error('Expected a non-null DisputeManager');
    }
    return this.disputeManager;
  }
}

export class DisputeGame {
  private challenger: ChallengerAgent;
  private proposer: ChallengerAgent;
  private globalContext = new GlobalContext();

  constructor(numSplits: number, challengerStates: State[], proposerStates: State[]) {
    this.proposer = new ChallengerAgent('proposer', proposerStates, numSplits, this.globalContext);
    this.challenger = new ChallengerAgent(
      'challenger',
      challengerStates,
      numSplits,
      this.globalContext
    );
  }

  private getActor(): ChallengerAgent {
    if (this.globalContext.getValidDisputeManager().lastMover === 'challenger') {
      return this.proposer;
    }
    return this.challenger;
  }

  public get lastMover(): string {
    return this.globalContext.getValidDisputeManager().lastMover;
  }

  public get loser(): string {
    return this.globalContext.getValidDisputeManager().loser;
  }

  public runDispute(): {detectedFraud: boolean; states: Hash[]} {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!this.getActor().split()) {
        return {
          detectedFraud: this.getActor().proveFraudOrForfeit(),
          states: this.globalContext.getValidDisputeManager().lastCalldata
        };
      }
    }
  }
}
