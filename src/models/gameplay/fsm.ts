import { GameState } from "@/utils/comms-manager";
import { assign, createMachine } from "xstate";

// State machine
export const gameplayMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswAcA2KCeAtGigMYAWAlgHZgB0JA9lTSQC7VQDEETd1AbgwDWdGKwDi6MACkG1ACIpWKANoAGALqJQmBrArsm2kAA9EBAIwBmAOy0btgJxqAHABZbANgBMLlwFYAGhA8RAsXWm8bC29vf3CrNzdPGz8AXzTg1AwcfCJSShp6JhZ2Ki4wACdKhkraXNYAM1q0WjFJDFkFJVVNY119QypjMwRLW3snVw8bHz8gkLCLC0jvGZs3C08XbysYjKypXMJicmo6RmYwNgomAGUAVxISOFhOdS0kEAGDW+Gv0a+Ry0ZL+XZWNQxOKxGzBUIIKz+WhWPYWNRrfz+RypNYHEDZLC4E4Fc7FK43e5PF6wN4qCyfHR6X5GAGIIEgzxglGQ2JgqJwsKeKzI1EWNw2NSOKyObyOfx4gnHfJnIoAIzArAAklQAAo1KCVV6cABCAFEACrmzUAOXEAH0rQBZU0AJTtAHkAGquj79JlDEaITxSyIQvxqNxqGw2GUuAUISMi5agxwuTybGzyzL4o5E5WFOjqrW6-WGmkmi1W20OzXOt0AVR18gAgubTb6vj8A6yE-FkWtPFH-C4rLz45Y3LRPNsXBYHDsIcPMwrc3lTgW2lIXQwHlQINq9QwDUaAMIu5t3AASHvr5o7jMGf0DCGTakiPjFkMjads8c2tC2JIPGnYdhxcFccjzddSQJbdd33EsjzLN5xGbZ07Rdd162teQ7QAMRtTUr1NeR72+f0nx7V9328T9Px-WFFhfTwVkcMU3DiTkhVHTEIMJNcSSKWCdz3A9S1eE9KhQWAyHdB5WE4VD0Mw7DcII60iMvEiyK7SjQFGLYbG8WhHDcRxpxcRxU1ibw-xWQD4hY1NJWsTwMmzKgGAgOBjEVKDBLAP1HxZfTzExN85WnTk1GlNQfE8cc0WMrY-F2NZaJcTMLD4pVoKKS5Sg4ILmX+UKxn8dETP8KKKti+L4whexxRcKM0xa1JzKzQ5IIElULhKa4hlNapamK7syp2SILD5RFtlHSMEqYtEImxGZYgSSEZRy-y+rJQrKWeV4xr00xEEy5EKvTOdB1lKJGPhaUTOxFrllmG7U223qNyLMSkKOzsKJC06E1MgC5qFaMzP8aIrD-N8R2TTlUyu5dsz8r6YK3ESEMPY8aWOoHRhlFZNhHFiIwlTNbKYtwIlcZZAPCNRMTMz7iV24T4N+vHYEk6TZPkgnSuB6x3CnMEY2q2YkkROyp3TGWQICdI0dXdmN05vc8OoCgZMgIXnwsNi7ESGK4sjKMPDcP8VvYuJoelaMrLcdy0iAA */
  id: "gameplay-machine",
  types: {},
  initial: "connecting",
  context: {
    displayName: '',
    bettingTimeLeft: 0,
    roundHistory: [],
    selectedBetAmount: 1,
    multiplerResult: 1,
    balance: 0,
    roundId: '',
    isPlayerCrashedOut: false,
    isGameRoundInProgress: true,
  },
  states: {
    connecting: {
      invoke: {
        id: 'getGameJoinData',
        src: 'getGameJoinData',
        // input: ({ context: { userId } }) => ({ userId }),
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
          // actions: assign({ error: ({ event }) => event.error }),
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
        }
      ]
    },

    betInProgress: {
      on: {
        BETTING_TIMER_OVER: { target: 'gameRoundInProgress' },
        BETTING_TIMER_UPDATE: { },
        PLACE_BETS: {}
      }
    },

    gameRoundInProgress: {
      on: {
        CRASH_OUT: { target: 'gameRoundInProgressCrashOut' },
        GAME_ROUND_FINISHED: { target: 'gameRoundFinished' },
      }
    },

    gameRoundInProgressCrashOut: {
      on: {
        GAME_ROUND_FINISHED: { target: 'gameRoundFinished' },
      }
    },

    gameRoundFinished: {}
  },
});
