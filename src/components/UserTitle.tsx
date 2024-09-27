import { useSelector } from '@xstate/react';
import { gameplay } from '@/models/gameplay/gameplay';
import { GameplayMachineSnapshot } from '@/models/gameplay/fsm';
import { useMemo } from 'react';

const selectGameState = (snapshot: GameplayMachineSnapshot): string => {
  return snapshot.value as string;
}

const selectDisplayName = (snapshot: GameplayMachineSnapshot): string => {
  return snapshot.context.displayName;
}

export function UserTitle() {
  const gameStateValue = useSelector(gameplay, selectGameState);
  const userName = useSelector(gameplay, selectDisplayName);

  const gameState = useMemo(() => {
    return <span>{gameStateValue}</span>;
  }, [gameStateValue]); // Empty dependency array ensures it is only rendered once

  if (userName) {
    return (
      <div>
        <div className='user-title-bar'>Hello, {userName} ({gameState})</div>
      </div>
    );
  }

  return (
    <div className='user-title-bar'>Please wait.. connecting..</div>
  );
}