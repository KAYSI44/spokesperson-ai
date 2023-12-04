'use client';

import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { calculateWordsPerMinute } from '@/lib/statistics';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import GaugeChart from '../charts/gauge-chart';

export default function WPMStats({ className }: { className?: string }) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const transcripts = events
    ?.map((event) => ({
      timestamp: event?.timestamp ?? 0,
      transcript: event?.transcription?.text ?? '',
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const maxTimestamp = Math.max(
    ...(transcripts?.map((transcript) => transcript.timestamp ?? 1) ?? [1]),
  );

  const wpmScore = useMemo(
    () => (transcripts ? calculateWordsPerMinute(transcripts) : undefined),
    [transcripts, maxTimestamp],
  );

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Words per Minute
        </h3>
      </div>

      {wpmScore && (
        <div>
          <GaugeChart
            percent={wpmScore / (maxTimestamp * 60)}
            className="w-56 h-40 mx-auto"
          />
          <p className="text-xl font-bold text-center">{Math.round(wpmScore)} WPM</p>
        </div>
      )}
    </div>
  );
}
