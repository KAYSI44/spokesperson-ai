'use client';

import Image from 'next/image';
import { useContext, useMemo } from 'react';
import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';

export default function CurrentFrame() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);
  const { currentTimestamp } = useContext(ReviewContext);

  const frames = events?.map((event) => event.storedFrame?.uri as string);

  const currentFrame = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    return currentEvent?.storedFrame?.uri;
  }, [currentTimestamp, events]);

  if (!currentFrame || !frames?.length) return;

  return (
    <div className="w-[36rem] h-[24rem] relative">
      {frames.map((uri) => (
        <Image
          key={uri}
          src={uri}
          alt=""
          fill
          className={cn('object-cover transition-opacity', uri !== currentFrame ? 'opacity-0' : 'opacity-100')}
        />
      ))}
    </div>
  );
}
