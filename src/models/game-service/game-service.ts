import { Observable, take } from "rxjs";
import { BetActionResultData, BettingTimerStartedData, BettingTimerUpdateData, CommsManager, CrashOutResultData, GameFinishedData, GameJoinedData, GameUpdateData } from "@/utils/comms-manager";

import { DisposeBag, type Disposable } from "../../utils/dispose-bag";
import { resolve } from "path";

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

  placeBetRequest(betAmount: number): Promise<BetActionResultData> {
    return new Promise<BetActionResultData>(resolve => {
      this._commsManager.placeBetRequest(betAmount);
      this._disposeBag.completable$(this._commsManager.betActionResult$.pipe(take(1))).subscribe(result => {
        resolve(result);
      });
    });

  }

  crashOutRequest(): Promise<CrashOutResultData> {
    return new Promise<CrashOutResultData>(resolve => {
      this._commsManager.crashOutRequest();
      this._disposeBag.completable$(this._commsManager.crashOutResult$.pipe(take(1))).subscribe(result => {
        resolve(result);
      });
    });
  }

  get betActionResult$(): Observable<BetActionResultData> {
    return this._commsManager.betActionResult$;
  }

  get crashOutResult$(): Observable<CrashOutResultData> {
    return this._commsManager.crashOutResult$;
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
