import { CommsManager, GameJoinedData } from "@/utils/comms-manager";
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
}
