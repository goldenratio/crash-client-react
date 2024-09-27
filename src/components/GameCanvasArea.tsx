import { useMemo } from "react";
import { useSelector } from "@xstate/react";

import { gameplay } from "@/models/gameplay/gameplay";
import { GameplayMachineSnapshot } from "@/models/gameplay/fsm";

import { Card } from "./ui/card";
import { BettingTimer } from "./BettingTimer";

const selectMultiplierValue = (snapshot: GameplayMachineSnapshot): number => {
  return snapshot.context.multiplierResult;
}

const setShowMultiplier = (snapshot: GameplayMachineSnapshot): boolean => {
  const state = snapshot.value as string;
  return state !== 'betInProgress';
}

export function GameCanvasArea() {
  const multiplierValue = useSelector(gameplay, selectMultiplierValue);
  const showMultiplier = useSelector(gameplay, setShowMultiplier);
  // Memoize the GameArea and Multiplier to prevent unnecessary re-renders
  // const gameArea = useMemo(() => {
  //   return <div id="canvas-stage">GameArea {roundToTwoDecimals(Math.random()).toFixed(2)}</div>;
  // }, []); // Empty dependency array ensures it is only rendered once

  const multiplier = useMemo(() => {
    return showMultiplier ? <div className="multiplier-value">{multiplierValue.toFixed(2)}x</div> : null;
  }, [multiplierValue, showMultiplier]); // Empty dependency array ensures it is only rendered once


  return (
    <Card className="relative w-full overflow-hidden p-1 my-2">
      <div className="game-canvas-container">
        {multiplier}
        <BettingTimer />
      </div>
    </Card>
  )
}