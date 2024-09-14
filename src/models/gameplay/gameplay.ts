import { createActor, fromPromise } from "xstate";
import { createBrowserInspector } from '@statelyai/inspect';

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