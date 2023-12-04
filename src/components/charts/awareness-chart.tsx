'use client';

import { useMemo } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculateAwarenessScore, secondsToMMSS } from '@/lib/utils';

ChartJS.register(...registerables);

export default function AwarenessChart() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const eyesOpenTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map(
        (event) =>
          event?.faceAnalysis?.map((face) => ({
            time: event.timestamp,
            value: face.EyesOpen.Confidence,
          }))?.[0],
      )
      .filter((event) => !!event) as { time: number; value: number }[];

    return filteredEvents.sort((a, b) =>
      a?.time > b?.time ? 1 : a?.time < b?.time ? -1 : 0,
    );
  }, [events]);

  const awarenessScoreTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map((event) => {
        const faceAnalysis = event?.faceAnalysis?.[0];

        if (!faceAnalysis) return undefined;

        const { Pitch, Yaw } = faceAnalysis.EyeDirection;
        const { Confidence } = faceAnalysis.EyesOpen;

        return {
          time: event.timestamp,
          value: calculateAwarenessScore(Pitch, Yaw, Confidence),
        };
      })
      .filter((event) => !!event) as { time: number; value: number }[];

    return filteredEvents.sort((a, b) =>
      a?.time > b?.time ? 1 : a?.time < b?.time ? -1 : 0,
    );
  }, [events]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Awareness Chart
        </h3>
      </div>

      {eyesOpenTimeSeries && awarenessScoreTimeSeries ? (
        <Line
          options={{}}
          className="grow shrink-0 w-full"
          data={{
            labels: eyesOpenTimeSeries.map((field) =>
              secondsToMMSS(field.time),
            ),
            datasets: [
              {
                label: 'Eyes Open',
                data: eyesOpenTimeSeries.map((field) => field.value / 100),
              },
              {
                label: 'Awareness',
                data: awarenessScoreTimeSeries.map(
                  (field) => field.value / 100,
                ),
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
