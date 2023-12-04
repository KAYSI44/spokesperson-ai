'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { countOccurences, isDefined } from '@/lib/typing';

ChartJS.register(...registerables);

export default function OverallKeyPhrases() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const keyPhraseBuckets = useMemo(() => {
    if (!events) return undefined;

    const keyPhrases = events
      .map((event) => event?.keyPhrases?.keyPhrases)
      .filter(isDefined)
      .flat();

    return countOccurences(keyPhrases);
  }, [events]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Key Topics
        </h3>
      </div>

      {keyPhraseBuckets && (
        <Bar
          options={{
            devicePixelRatio: 4,
          }}
          className="grow shrink-0 w-full"
          data={{
            labels: Object.keys(keyPhraseBuckets),
            datasets: [
              {
                label: 'Occurences',
                data: Object.values(keyPhraseBuckets),
              },
            ],
          }}
        />
      )}
    </div>
  );
}
