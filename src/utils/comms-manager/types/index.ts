export enum GameState {
  IDLE = 0,
  BETTING_IN_PROGRESS = 1,
  GAME_IN_PROGRESS = 2,
}

export type AuthResponseType =
  | { success: false }
  | { success: true; jwtToken: string; uuid: string; displayName: string };

export type GameJoinedData = {
  gameState: GameState;
  bettingTimeLeft: number;
  multiplier: number;
  roundTimeElapsed: number;
  displayName: string;
  balance: number;
};

export type ConnectionClosedData = { errorCode: number; reason: string };
export type GameStartedData = { gameState: GameState };
export type GameUpdateData = { multiplier: number };
export type GameFinishedData = { gameState: GameState };
export type CrashOutResultData = { winAmount: number; multiplier: number };
export type BettingTimerUpdateData = { bettingTimeLeft: number; roundId: number };
export type RemotePlayerJoinedData = { displayName: string };
export type RemotePlayerLeftData = { displayName: string };
export type RemotePlayerBetsPlacedData = { displayName: string; betAmount: number };
export type RemotePlayerCrashOutData = { displayName: string; winAmount: number };
