import { assign, createActor, fromPromise } from "xstate";
import { createBrowserInspector } from '@statelyai/inspect';

import { delay } from "@/utils/time-utils";
import { DisposeBag } from "@/utils/dispose-bag";

import { gameplayMachine } from "./fsm";
import { GameService } from "../game-service";

const { inspect } = createBrowserInspector();

const disposeBag = new DisposeBag();

function createGameplay() {
  console.log('creating GamePlay object!');
  const service = new GameService();

  const actor = createActor(gameplayMachine.provide({
    actions: {
      placeBetRequest: async ({ event }) => {
        if (event.type === 'PLACE_BETS') {
          const betAmount = event.betAmount;
          service.placeBetRequest(betAmount);
        }
      },
      crashOutRequest: async ({ event }) => {
        if (event.type === 'CRASH_OUT') {
          service.crashOutRequest();
        }
      }
    },
    actors: {
      getGameJoinData: fromPromise(async () => {
        await delay(2000);
        const data = await service.connect();
        return data;
      })
    },
    guards: {},
  }), {
    inspect
  });

  actor.start();

  disposeBag.completable$(service.bettingTimerStarted$)
    .subscribe(data => actor.send({ type: 'BETTING_TIMER_STARTED', timeLeft: data.bettingTimeLeft, roundId: data.roundId }));

  disposeBag.completable$(service.bettingTimerUpdate$).subscribe(data => actor.send({ type: 'BETTING_TIMER_UPDATE', timeLeft: data.bettingTimeLeft }));
  disposeBag.completable$(service.bettingTimerFinished$).subscribe(() => actor.send({ type: 'BETTING_TIMER_FINISHED' }));

  disposeBag.completable$(service.betActionResult$).subscribe(({ balance }) => actor.send({ type: 'BET_ACTION_RESULT', balance: balance }));
  disposeBag.completable$(service.crashOutResult$).subscribe(({ winAmount, balance }) => actor.send({ type: 'CRASH_OUT_RESULT', balance: balance, winAmount: winAmount }));

  disposeBag.completable$(service.gameRoundUpdate$).subscribe(({ multiplier }) => actor.send({ type: 'GAME_ROUND_UPDATE', multiplier: multiplier }));
  disposeBag.completable$(service.gameRoundFinished$).subscribe(() => actor.send({ type: 'GAME_ROUND_FINISHED' }));

  return actor;
}

export const gameplay = createGameplay();