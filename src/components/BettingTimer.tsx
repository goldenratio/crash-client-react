import { useState, useEffect } from 'react';
import { useSelector } from '@xstate/react';

import { gameplay } from '@/models/gameplay';
import { GameplayMachineSnapshot } from '@/models/gameplay/fsm';

const setBettingRoundInProgress = (snapshot: GameplayMachineSnapshot): boolean => {
  const state = snapshot.value as string;
  return state === 'betInProgress';
}

export function BettingTimer() {
  // in seconds
  const duration = 4;

  const [timeLeft, setTimeLeft] = useState(duration);
  const enabled = useSelector(gameplay, setBettingRoundInProgress);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (enabled) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);
      } else if (timeLeft === 0) {
        console.log('animation complete!');
      }
    } else {
      setTimeLeft(duration);
    }

    return () => {
      clearInterval(timer);
    }
  }, [enabled, timeLeft]);

  const radius = 50; // Radius of the circle
  const stroke = 6; // Thickness of the circle border
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (timeLeft / duration) * circumference;

  // Calculate color based on time left
  const getColor = () => {
    const red = Math.min(255, (1 - timeLeft / duration) * 255);
    const green = Math.min(255, (timeLeft / duration) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  if (!enabled) {
    return null;
  }
  return (
    <div className="timer-container transition-all scale-0 duration-300 linear animate-pulse">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="circle-progress"
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            animation: `colorChange ${duration}s linear`,
          }}
        />
      </svg>
      <div className="time-left">{timeLeft + 1}</div>
    </div>
  );
}
