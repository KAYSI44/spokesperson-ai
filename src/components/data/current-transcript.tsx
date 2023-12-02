'use client';

import { useContext, useMemo } from 'react';
import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';

interface CurrentTranscriptProps {
  className?: string;
}

export default function CurrentTranscript({
  className,
}: CurrentTranscriptProps) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);
  const { currentTimestamp } = useContext(ReviewContext);

  const currentTranscript = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    return currentEvent?.transcription?.text;
  }, [currentTimestamp, events]);

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Transcript
        </h3>
      </div>

      <p className="overflow-hidden text-ellipsis line-clamp-2 h-12">
        {currentTranscript ?? 'NIL'}
      </p>
    </div>
  );
}
