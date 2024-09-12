import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { randomFloat, roundToTwoDecimals } from "@/utils/math-utils";

type RoundHistoryData = { value: number; id: number };

export function RoundHistory() {
  const [history, setHistory] = useState<RoundHistoryData[]>([]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const newMultiplier = roundToTwoDecimals(randomFloat(1, 100));
      const seq: number = history[0] ? history[0].id + 1 : 0;
      const val = [{ value: newMultiplier, id: seq }, ...history].slice(0, 20);
      setHistory(val);
    }, 5000);

  //Clearing the interval
    return () => clearInterval(timerId);
  }, [history]);

  return (
    <Card className="relative w-full p-4">
      <div className="overflow-hidden">
        <div className="flex flex-row items-center space-x-2">
            {history.map(({ value, id }) => (
              <div
                key={id}
                className="transition-all duration-300 ease-in-out animate-pulse"
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