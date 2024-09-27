import { Observable } from "rxjs";
import { BettingTimerStartedData, BettingTimerUpdateData, CommsManager, GameFinishedData, GameJoinedData, GameUpdateData } from "@/utils/comms-manager";

import { DisposeBag, type Disposable } from "../../utils/dispose-bag";

export class GameService implements Disposable {
  private readonly _commsManager: CommsManager;
  private readonly _disposeBag = new DisposeBag();

  constructor() {
    console.log("game service");
    this._commsManager = new CommsManager();
  }

  connect(): Promise<GameJoinedData> {
    return new Promise((resolve, reject) => {
      this._commsManager.connect()
      .then(joinData => {
        if (joinData.type === 'error') {
          reject('connection failed!');
        } else {
          resolve(joinData);
        }
      });
    });
  }

  dispose(): void {
    this._disposeBag.dispose();
  }

  placeBetRequest(betAmount: number): void {
    this._commsManager.placeBetRequest(betAmount);
  }

  get bettingTimerStarted$(): Observable<BettingTimerStartedData> {
    return this._commsManager.bettingTimerStarted$;
  }

  get bettingTimerUpdate$(): Observable<BettingTimerUpdateData> {
    return this._commsManager.bettingTimerLeft$;
  }

  get bettingTimerFinished$(): Observable<void> {
    return this._commsManager.bettingTimerFinished$;
  }

  get gameRoundFinished$(): Observable<GameFinishedData> {
    return this._commsManager.gameFinished$;
  }

  get gameRoundUpdate$(): Observable<GameUpdateData> {
    return this._commsManager.gameUpdate$;
  }
}
