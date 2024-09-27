import { useMemo, useState } from "react";
import { useSelector } from "@xstate/react";

import { toInt } from "@/utils/type-utils";
import { gameplay } from "@/models/gameplay";
import { GameplayMachineSnapshot } from "@/models/gameplay/fsm";

import { Card } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

type BetAreaType = 'place-bet' | 'cancel-bet' | 'crash-out' | 'disabled';

const setBettingAreaState = (snapshot: GameplayMachineSnapshot): BetAreaType => {
  const state = snapshot.value as string;
  if (state === 'betInProgress' && snapshot.context.wageredBetAmount === 0) {
    return 'place-bet';
  }

  if (state === 'betInProgress' && snapshot.context.wageredBetAmount > 0) {
    return 'cancel-bet';
  }

  if (state === 'gameRoundInProgress' && snapshot.context.wageredBetAmount > 0) {
    return 'crash-out';
  }

  return 'disabled';
}

const setWageredBetAmount = (snapshot: GameplayMachineSnapshot): number => {
  return snapshot.context.wageredBetAmount;
}

export function BetArea() {
  const betValues = [1, 2, 5, 10, 50, 75, 100];
  const defaultBetAmount = betValues[0];

  const [selectedValue, setSelectedValue] = useState(defaultBetAmount);
  const state = useSelector(gameplay, setBettingAreaState);

  // Handle the toggle change, ensuring one item is always selected
  const handleBetToggleChange = (value: string) => {
    setSelectedValue(toInt(value) || defaultBetAmount);
  };

  const handlePlaceBetButton = () => {
    console.log(`place bet: ${selectedValue}`);
    gameplay.send({ type: 'PLACE_BETS', betAmount: selectedValue });
  };

  const handleCancelBetButton = () => {
    gameplay.send({ type: 'PLACE_BETS', betAmount: 0 });
  };

  const handleCrashButton = () => {
    gameplay.send({ type: 'CRASH_OUT' });
  };

  const enabled = state === 'place-bet';

  const placeBetButton = useMemo(() => {
    if (state === 'place-bet' || state === 'disabled') {
      return (
        <Button
            disabled={!enabled}
            className="p-0 m-0 bg-none border-none shadow-none focus:outline-none w-[200px]" // Remove all padding, margin, background, border, and shadow
            variant={null} // Remove the variant prop
            onClick={handlePlaceBetButton}
            asChild={false}
          >
            <div className="bet-area-button">
              <div>BET</div>
              <div>{selectedValue}</div>
            </div>
          </Button>
      );
    }
    return null;
  }, [state, selectedValue]);

  const cancelBetButton = useMemo(() => {
    if (state === 'cancel-bet') {
      return (
        <Button
            className="p-0 m-0 bg-none border-none shadow-none focus:outline-none w-[200px]" // Remove all padding, margin, background, border, and shadow
            variant={null} // Remove the variant prop
            onClick={handleCancelBetButton}
            asChild={false}
          >
            <div className="bet-area-cancel-button">
              <div>Cancel Bets</div>
            </div>
          </Button>
      );
    }
    return null;
  }, [state]);

  const crashOutButton = useMemo(() => {
    if (state === 'crash-out') {
      return (
        <Button
            className="p-0 m-0 bg-none border-none shadow-none focus:outline-none w-[200px]" // Remove all padding, margin, background, border, and shadow
            variant={null} // Remove the variant prop
            onClick={handleCrashButton}
            asChild={false}
          >
            <div className="bet-area-crash-button">
              <div>Crash Out</div>
            </div>
          </Button>
      );
    }
    return null;
  }, [state]);

  return (
    <Card className="relative w-full overflow-hidden p-1">
      <div className="bet-area-container">
        <div className="bet-select-container">
          <div className="bet-select-holder">
            <ToggleGroup
              disabled={!enabled}
              variant="outline"
              type="single"
              defaultChecked
              value={selectedValue.toString()}
              onValueChange={handleBetToggleChange}
              asChild={true}
            >
              {betValues.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value.toString()}
                  className="flex-1 min-w-[40px] text-center m-1"
                >
                  {value}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        {placeBetButton}
        {cancelBetButton}
        {crashOutButton}

      </div>
    </Card>
  )
}
