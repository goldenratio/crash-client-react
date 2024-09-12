import type { Disposable } from "../../utils/dispose-bag";

export class GameService implements Disposable {
  constructor() {
    console.log("game service");
  }

  dispose(): void {
    //
  }
}
