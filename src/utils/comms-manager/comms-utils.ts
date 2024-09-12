import { assertNever } from "../assert-utils";
import { GameState } from "./types";

export function convertGameStateToValue(state: GameState): string {
  switch (state) {
    case GameState.IDLE:
      return "idle";
    case GameState.BETTING_IN_PROGRESS:
      return "BETTING_IN_PROGRESS";
    case GameState.GAME_IN_PROGRESS:
      return "GAME_IN_PROGRESS";

    default:
      assertNever(state);
  }
}
