import { useSelector } from '@xstate/react';
import { gameplay } from '@/models/gameplay/gameplay';

const selectDisplayName = (snapshot: any): string => {
  console.log('snapshot: ', snapshot);
  return snapshot.context.displayName;
}

export function UserTitle() {
  const userName = useSelector(gameplay, selectDisplayName);

  if (userName) {
    return (
      <div className='m-2'>Hello, {userName}</div>
    );
  }

  return (
    <div className='m-2'>Please wait.. connecting..</div>
  );
}