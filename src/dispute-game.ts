import {ChallengeManager, ChallengerAgent} from '.';
import {State, expectedNumOfLeaves, stepForIndex} from './challenge-manager';
import {Hash} from './merkle';
import {fingerprint} from './tests/challenge-manager.test';

export class DisputeGame {
  private cm: ChallengeManager;
  challenger: ChallengerAgent;
  proposer: ChallengerAgent;

  constructor(
    public numSplits: number,
    public challengerStates: State[],
    public proposerStates: State[]
  ) {
    const initialStates = [];
    for (let i = 0; i < expectedNumOfLeaves(0, proposerStates.length - 1, numSplits); i++) {
      const index = i === 0 ? 0 : stepForIndex(i, 0, proposerStates.length - 1, numSplits);
      initialStates.push(proposerStates[index]);
    }

    this.cm = new ChallengeManager(
      initialStates.map(fingerprint),
      state => ({root: state.root + 1}),
      fingerprint,
      'proposer',
      this.challengerStates.length - 1,
      this.numSplits
    );

    this.proposer = new ChallengerAgent('proposer', this.cm, this.proposerStates, this.numSplits);
    this.challenger = new ChallengerAgent(
      'challenger',
      this.cm,
      this.challengerStates,
      this.numSplits
    );
  }

  private getActor(): ChallengerAgent {
    if (this.cm.caller === 'challenger') {
      return this.proposer;
    }
    return this.challenger;
  }

  public get caller(): string {
    return this.cm.caller;
  }

  public get loser(): string {
    return this.cm.loser;
  }

  public runDispute(): {detectedFraud: boolean; states: Hash[]} {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!this.getActor().split()) {
        return {
          detectedFraud: this.getActor().detectFraudOrForfiet(),
          states: this.cm.lastCalldata
        };
      }
    }
  }
}
