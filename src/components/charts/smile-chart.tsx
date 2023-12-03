'use client';

import { useMemo } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { secondsToMMSS } from '@/lib/utils';

ChartJS.register(...registerables);

export default function SmileChart() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const smileTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map(
        (event) =>
          event.faceAnalysis?.map((face) => ({
            time: event.timestamp,
            value: face.Smile.Confidence,
          }))?.[0],
      )
      .filter((event) => !!event) as { time: number; value: number }[];

    return filteredEvents.sort((a, b) =>
      a?.time > b?.time ? 1 : a?.time < b?.time ? -1 : 0,
    );
  }, [events]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Smile Chart
        </h3>
      </div>

      {smileTimeSeries ? (
        <Line
          options={{}}
          className="grow shrink-0 w-full"
          data={{
            labels: smileTimeSeries.map((field) => secondsToMMSS(field.time)),
            datasets: [
              {
                label: 'Eyes Open',
                data: smileTimeSeries.map((field) => field.value / 100),
              },
            ],
          }}
        />
      ) : (
        <div className="text-sm text-white/80 grow shrink-0 w-full grid place-content-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
