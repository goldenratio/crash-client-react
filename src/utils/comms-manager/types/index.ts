export enum GameState {
  IDLE = 0,
  BETTING_IN_PROGRESS = 1,
  GAME_IN_PROGRESS = 2,
}

export type AuthResponseType =
  | { success: false }
  | { success: true; jwtToken: string; uuid: string; displayName: string };

export type GameJoinedData = {
  type: 'success';
  gameState: GameState;
  bettingTimeLeft: number;
  multiplier: number;
  roundTimeElapsed: number;
  displayName: string;
  balance: number;
};

export type GameJoinError = {
  type: 'error'
};

export type ConnectionClosedData = { errorCode: number; reason: string };
export type GameStartedData = { gameState: GameState };
export type GameUpdateData = { multiplier: number };
export type GameFinishedData = { gameState: GameState };
export type CrashOutResultData = { winAmount: number; multiplier: number; balance: number };
export type BetActionResultData = { balance: number; };
export type BettingTimerStartedData = { bettingTimeLeft: number; roundId: string };
export type BettingTimerUpdateData = { bettingTimeLeft: number; };
export type RemotePlayerJoinedData = { displayName: string };
export type RemotePlayerLeftData = { displayName: string };
export type RemotePlayerBetsPlacedData = { displayName: string; betAmount: number };
export type RemotePlayerCrashOutData = { displayName: string; winAmount: number };
