import { roundToTwoDecimals } from "@/utils/math-utils";
import { Card } from "./ui/card";

export function GameCanvasArea() {
  return (
    <Card className="relative w-full overflow-hidden p-1 my-2">
      <div className="game-canvas-container">
        <div>GameArea {Math.random()}</div>
        <div>Multiplier: {roundToTwoDecimals(Math.random())}x</div>
        <div>GameState: -</div>
      </div>
    </Card>
  )
}