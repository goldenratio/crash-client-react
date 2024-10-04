import { GameState } from "@/utils/comms-manager";
import { assign, createMachine, EventFromLogic, SnapshotFrom } from "xstate";

export type GameplayMachineSnapshot = SnapshotFrom<typeof gameplayMachine>;
export type GameplayMachineEvent = EventFromLogic<typeof gameplayMachine>;

const EventType = {} as
  | { type: 'BETTING_TIMER_FINISHED' }
  | { type: 'BETTING_TIMER_STARTED'; timeLeft: number; roundId: string }
  | { type: 'BETTING_TIMER_UPDATE'; timeLeft: number }
  | { type: 'PLACE_BETS'; betAmount: number }
  | { type: 'BET_ACTION_RESULT'; balance: number }
  | { type: 'CRASH_OUT' }
  | { type: 'CRASH_OUT_RESULT'; balance: number; winAmount: number }
  | { type: 'GAME_ROUND_UPDATE'; multiplier: number }
  | { type: 'GAME_ROUND_FINISHED' };

const ContextType = {} as {
  readonly displayName: string;
  readonly bettingTimeLeft: number;
  readonly roundHistory: Array<number>;
  readonly multiplierResult: number;
  readonly balance: number;
  readonly roundId: string;
  readonly isPlayerCrashedOut: boolean;
  readonly isGameRoundInProgress: boolean;
  readonly wageredBetAmount: number;
};

// State machine
export const gameplayMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswAcA2KCeAtGigMYAWAlgHZgB0JA9lTSQC7VQDEETd1AbgwDWdGKwDi6MACkG1ACIpWKANoAGALqJQmBrArsm2kAA9EBAIwBmAOy0btgJxqAHABZbANgBMLlwFYAGhA8RAsXWm8bC29vf3CrNzdPGz8AXzTg1AwcfCJSShp6JhZ2Ki4wACdKhkraXNYAM1q0WjFJDFkFJVVNY119QypjMwRLW3snVw8bHz8gkLCLC0jvGZs3C08XbysYjKypXMJicmo6RmYwNgomAGUAVxISOFhOdS0kEAGDW+Gv0a+Ry0ZL+XZWNQxOKxGzBUIIKz+WhWPYWNRrfz+RypNYHEDZLC4E4Fc7FK43e5PF6wN4qCyfHR6X5GAGIIEgzxglGQ2JgqJwsKeKzI1EWNw2NSOKyObyOfx4gnHfJnIoAIzArAAklQAAo1KCVV6cABCAFEACrmzUAOXEAH0rQBZU0AJTtAHkAGquj79JlDEaITxSyIQvxqNxqGw2GUuAUISMi5agxwuTybGzyzL4o5E5WFOjqrW6-WGmkmi1W20OzXOt0AVR18gAgubTb6vj8A6yE-FkWtPFH-C4rLz45Y3LRPNsXBYHDsIcPMwrc3lTgW2lIXQwHlQINq9QwDUaAMIu5t3AASHvr5o7jMGf0DCGTakiPjFkMjads8c2tC2JIPGnYdhxcFccjzddSQJbdd33EsjzLN5xGbZ07Rdd162teQ7QAMRtTUr1NeR72+f0nx7V9328T9Px-WFFhfTwVkcMU3DiTkhVHTEIMJNcSSKWCdz3A9S1eE9KhQWAyHdB5WE4VD0Mw7DcII60iMvEiyK7SjQFGLYbG8WhHDcRxpxcRxU1ibw-xWQD4hY1NJWsTwMmzKgGAgOBjEVKDBLAP1HxZfTzExN85WnTk1GlNQfE8cc0WMrY-F2NZaJcTMLD4pVoKKS5Sg4ILmX+UKxn8dETP8KKKti+L4whexxRcKM0xa1JzKzQ5IIElULhKa4hlNapamK7syp2SILD5RFtlHSMEqYtEImxGZYgSSEZRy-y+rJQrKWeV4xr00xEEy5EKvTOdB1lKJGPhaUTOxFrllmG7U223qNyLMSkKOzsKJC06E1MgC5qFaMzP8aIrD-N8R2TTlUyu5dsz8r6YK3ESEMPY8aWOoHRhlFZNhHFiIwlTNbKYtwIlcZZAPCNRMTMz7iV24T4N+vHYEk6TZPkgnSuB6x3CnMEY2q2YkkROyp3TGWQICdI0dXdmN05vc8OoCgZMgIXnwsNi7ESGK4sjKMPDcP8VvYuJoelaMrLcdy0iAA */
  id: "gameplay-machine",
  types: {
    events: EventType,
    context: ContextType,
  },
  initial: "connecting",
  context: {
    displayName: '',
    bettingTimeLeft: 0,
    roundHistory: [],
    multiplierResult: 1,
    balance: 0,
    roundId: '',
    isPlayerCrashedOut: false,
    isGameRoundInProgress: true,
    wageredBetAmount: 0
  },
  states: {
    connecting: {
      invoke: {
        id: 'getGameJoinData',
        src: 'getGameJoinData',
        onDone: {
          target: 'connectionSuccess',
          actions: assign({
            displayName: ({ event }) => event.output.displayName,
            bettingTimeLeft: ({ event }) => event.output.bettingTimeLeft,
            balance: ({ event }) => event.output.balance,
            isGameRoundInProgress: ({ event }) => event.output.gameState === GameState.GAME_IN_PROGRESS
          }),
        },
        onError: {
          target: 'connectionError',
        },
      },
    },

    connectionError: {
      type: 'final'
    },

    connectionSuccess: {
      always: [
        {
          guard: ({ context }) => !context.isGameRoundInProgress,
          target: 'betInProgress'
        },
        {
          guard: ({ context }) => context.isGameRoundInProgress,
          target: 'gameRoundInProgress'
        },
        {
          target: 'idle'
        }
      ]
    },

    idle: {
      on: {
        BETTING_TIMER_STARTED: {
          target: 'betInProgress',
          actions: assign({
            roundId: ({ event }) => event.roundId,
            bettingTimeLeft: ({ event }) => event.timeLeft,
            wageredBetAmount: () => 0
          })
        }
      }
    },

    betInProgress: {
      on: {
        BETTING_TIMER_FINISHED: { target: 'gameRoundInProgress' },
        BETTING_TIMER_UPDATE: {},
        PLACE_BETS: {
          actions: [
            assign({
              wageredBetAmount: ({ event }) => event.betAmount
            }),
            { type: 'placeBetRequest' }
          ]
        },
        BET_ACTION_RESULT: {
          actions: assign({
            balance: ({ event }) => event.balance
          })
        }
      }
    },

    gameRoundInProgress: {
      on: {
        CRASH_OUT: { actions: [{ type: 'crashOutRequest' }], target: 'gameRoundInProgressCrashOut' },
        GAME_ROUND_UPDATE: {
          actions: assign({
            multiplierResult: ({ event }) => event.multiplier
          }),
         },
        GAME_ROUND_FINISHED: { target: 'gameRoundFinished' },
      }
    },

    gameRoundInProgressCrashOut: {
      on: {
        GAME_ROUND_UPDATE: {
          actions: assign({
            multiplierResult: ({ event }) => event.multiplier
          }),
        },
        CRASH_OUT_RESULT: {
          actions: assign({
            balance: ({ event }) => event.balance
          })
        },
        GAME_ROUND_FINISHED: { target: 'gameRoundFinished' },
      }
    },

    gameRoundFinished: {
      always: {
        target: 'idle'
      }
    }
  },
});
