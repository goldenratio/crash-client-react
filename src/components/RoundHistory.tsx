import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { randomFloat, roundToTwoDecimals } from "@/utils/math-utils";
import { useSelector } from "@xstate/react";
import { gameplay } from "@/models/gameplay";
import { GameplayMachineSnapshot } from "@/models/gameplay/fsm";

type RoundHistoryData = { value: number; id: number };

const setBetInProgress = (snapshot: GameplayMachineSnapshot): boolean => {
  const state = snapshot.value as string;
  return state === 'betInProgress';
}

// todo: improve animation based on this,
// https://codesandbox.io/p/sandbox/animated-lists-with-react-and-framer-motion-jfwv3?file=%2Fsrc%2FApp.js%3A45%2C33

export function RoundHistory() {
  const [history, setHistory] = useState<RoundHistoryData[]>([]);
  const betInProgress = useSelector(gameplay, setBetInProgress);

  useEffect(() => {

    const subscription = gameplay.subscribe(snapshot => {
      const state = snapshot.value as string;
      if (state === 'idle') {
        // console.log('add history: ', snapshot.context.multiplierResult);
        const multiplierResult = snapshot.context.multiplierResult;
        const seq: number = history[0] ? history[0].id + 1 : 0;
        const val = [{ value: multiplierResult, id: seq }, ...history].slice(0, 20);
        setHistory(val);
        subscription.unsubscribe();
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [betInProgress, history]);

  return (
    <Card className="relative w-full p-4">
      <div className="overflow-hidden">
        <div className="flex flex-row items-center space-x-2 min-h-8">
            {history.map(({ value, id }) => (
              <div
                key={id}
                className="transition-all duration-300 scale-0 linear animate-pulse"
              >
                <Badge
                  variant="secondary"
                  className="w-12 h-8 flex items-center justify-center px-8"
                >
                  <span className="font-bold text-sm">
                    {value.toFixed(2)}x
                  </span>
                </Badge>
              </div>
            ))}
        </div>
      </div>

    </Card>
  );
}