'use client';

import { useMemo } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { calculateTotalConversationTime } from '@/lib/statistics';
import useReviewData from '@/hooks/use-review-data';
import { SILENCE_THRESHOLD } from '@/lib/constants';
import { cn } from '@/lib/utils';

ChartJS.register(...registerables);

export default function ConversationTime({
  className,
}: {
  className?: string;
}) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const transcripts = events
    ?.map((event) => ({
      timestamp: event?.timestamp ?? 0,
      transcript: event?.transcription?.text ?? '',
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const maxTimestamp = Math.max(
    ...(transcripts?.map((transcript) => transcript.timestamp ?? 0) ?? [0]),
  );

  const conversationTime = useMemo(() => {
    if (!transcripts) return undefined;

    return calculateTotalConversationTime(transcripts, SILENCE_THRESHOLD) / maxTimestamp;
  }, [transcripts, maxTimestamp]);

  return (
    <div
      className={cn(
        'w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col',
        className,
      )}
    >
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Conversation Time
        </h3>
      </div>

      {conversationTime !== undefined && (
        <Pie
          options={{
            devicePixelRatio: 4,
          }}
          className="grow shrink-0 w-full"
          data={{
            labels: ['Talking', 'Silence'],
            datasets: [
              {
                label: 'Time',
                data: [conversationTime, 1 - conversationTime],
              },
            ],
          }}
        />
      )}
    </div>
  );
}
