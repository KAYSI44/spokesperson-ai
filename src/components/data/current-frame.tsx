'use client';

import Image from 'next/image';
import { useContext, useMemo } from 'react';
import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';

interface CurrentFrameProps {
  className?: string;
}

export default function CurrentFrame({ className }: CurrentFrameProps) {
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
    <div className="p-6 rounded-lg bg-muted/50 overflow-hidden">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Interviewee
        </h3>
      </div>

      <div className={cn('w-[48rem] h-[28rem] relative border border-muted-foreground', className)}>
        {frames.map((uri) => (
          <Image
            key={uri}
            src={uri}
            alt=""
            fill
            className={cn(
              'object-cover transition-opacity',
              uri !== currentFrame ? 'opacity-0' : 'opacity-100',
            )}
          />
        ))}
      </div>
    </div>
  );
}
