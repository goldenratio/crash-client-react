import { useSelector } from "@xstate/react";

import { gameplay } from "@/models/gameplay";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { UserTitle } from "./UserTitle";
import { GameplayMachineSnapshot } from "@/models/gameplay/fsm";

const setBalance = (snapshot: GameplayMachineSnapshot): number => {
  return snapshot.context.balance;
}

export function TopBar() {
  const balance = useSelector(gameplay, setBalance);

  return (
    <Card className="relative w-full p-1 mb-2">
      <div className="top-bar">
        <div className="top-bar-logo">
          <span className="logo-text">Crash Game</span>
        </div>
        <div className="top-bar-content">
          <Button variant="secondary">
            <img src="/coin_06.png" width="20px" alt="coin" />
            <span className="coin-count">{balance.toLocaleString()}</span>
          </Button>
        </div>
      </div>
      <UserTitle />
    </Card>

  );
}