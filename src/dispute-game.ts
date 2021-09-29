import {ChallengeManager, ChallengerAgent} from '.';
import {State} from './challenge-manager';
import {Hash} from './merkle';

/**
 * Global context is the chain state.
 */
export class GlobalContext {
  /**
   * The ChallengeManager mimics the on-chain contract.
   * It can be 'deployed' and its state can be inspected.
   */
  public challengeManager: ChallengeManager | null = null;
  public deployChallengeManager(cm: ChallengeManager): void {
    this.challengeManager = cm;
  }

  public getValidChallengeManager(): ChallengeManager {
    if (!this.challengeManager) {
      throw new Error('Expected a non-null ChallengeManager');
    }
    return this.challengeManager;
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
    if (this.globalContext.getValidChallengeManager().lastMover === 'challenger') {
      return this.proposer;
    }
    return this.challenger;
  }

  public get caller(): string {
    return this.globalContext.getValidChallengeManager().lastMover;
  }

  public get loser(): string {
    return this.globalContext.getValidChallengeManager().loser;
  }

  public runDispute(): {detectedFraud: boolean; states: Hash[]} {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!this.getActor().split()) {
        return {
          detectedFraud: this.getActor().proveFraudOrForfeit(),
          states: this.globalContext.getValidChallengeManager().lastCalldata
        };
      }
    }
  }
}
