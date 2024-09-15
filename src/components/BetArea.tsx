import { useState } from "react";
import { Card } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { toInt } from "@/utils/type-utils";
import { Button } from "./ui/button";

export function BetArea() {
  const betValues = [1, 2, 5, 10, 50, 75, 100];
  const [ enabled, setEnabled ] = useState(true);

  // Initialize with a default selected value
  const [selectedValue, setSelectedValue] = useState(betValues[0]);

  // Handle the toggle change, ensuring one item is always selected
  const handleBetToggleChange = (value: string) => {
    if (value) {
      setSelectedValue(toInt(value) || betValues[0]);
    }
  };

  const handlePlaceBetButton = () => {
    console.log(`place bet: ${selectedValue}`);
  };

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
      </div>
    </Card>
  )
}
