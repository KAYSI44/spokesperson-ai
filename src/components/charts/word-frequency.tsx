'use client';

import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import ReactWordcloud from 'react-wordcloud';
import { calculateWordFrequency } from '@/lib/statistics';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { transformMapToArray } from '@/lib/typing';

export default function WordFrequency({ className }: { className?: string }) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const transcripts = events?.map((event) => ({
    timestamp: event?.timestamp ?? 0,
    transcript: event?.transcription?.text ?? '',
  }));

  const wordBuckets = useMemo(() => {
    if (!transcripts) return undefined;

    return transformMapToArray(calculateWordFrequency(transcripts, 100));
  }, [transcripts]);

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Word Frequency Cloud Chart
        </h3>
      </div>

      {wordBuckets && (
        <ReactWordcloud words={wordBuckets} options={{ rotations: 0 }} />
      )}
    </div>
  );
}
