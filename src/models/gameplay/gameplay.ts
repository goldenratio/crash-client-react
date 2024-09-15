import { createActor, fromPromise } from "xstate";
import { createBrowserInspector } from '@statelyai/inspect';

import { delay } from "@/utils/time-utils";

import { gameplayMachine } from "./fsm";
import { GameService } from "../game-service";

const { inspect } = createBrowserInspector();

function createGameplay() {
  console.log('creating GamePlay object!');
  const service = new GameService();

  const actor = createActor(gameplayMachine.provide({
    actions: {},
    actors: {
      getGameJoinData: fromPromise(async () => {
        await delay(2000);
        const data = await service.connect();
        return { ... data };
      })
    },
    guards: {},
  }), {
    inspect
  });

  actor.start();
  return actor;
}

export const gameplay = createGameplay();