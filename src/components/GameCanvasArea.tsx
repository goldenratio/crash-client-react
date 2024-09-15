import { useSelector } from "@xstate/react";
import { roundToTwoDecimals } from "@/utils/math-utils";
import { gameplay } from "@/models/gameplay/gameplay";

import { Card } from "./ui/card";
import { useMemo } from "react";

const selectGameState = (snapshot: any): string => {
  return snapshot.value;
}

const selectMultiplierValue = (snapshot: any): number => {
  return snapshot.context.multiplerResult;
}

export function GameCanvasArea() {
  const gameStateValue = useSelector(gameplay, selectGameState);
  const multiplierValue = useSelector(gameplay, selectMultiplierValue);

  // Memoize the GameArea and Multiplier to prevent unnecessary re-renders
  const gameArea = useMemo(() => {
    return <div id="canvas-stage">GameArea {roundToTwoDecimals(Math.random())}</div>;
  }, []); // Empty dependency array ensures it is only rendered once

  const multiplier = useMemo(() => {
    return <div>Multiplier: {multiplierValue}x</div>;
  }, [multiplierValue]); // Empty dependency array ensures it is only rendered once

  const gameState = useMemo(() => {
    return <div>GameState: {gameStateValue}</div>;
  }, [gameStateValue]); // Empty dependency array ensures it is only rendered once


  return (
    <Card className="relative w-full overflow-hidden p-1 my-2">
      <div className="game-canvas-container">
        {gameArea}
        {multiplier}
        {gameState}
      </div>
    </Card>
  )
}