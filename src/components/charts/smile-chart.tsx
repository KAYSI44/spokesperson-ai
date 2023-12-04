'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { Chart as ChartJS, type ChartData, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { secondsToMMSS } from '@/lib/utils';
import { createGradient } from '@/lib/charts';
import { isDefined } from '@/lib/typing';

ChartJS.register(...registerables);

export default function SmileChart() {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const smileTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map(
        (event) =>
          event?.faceAnalysis?.map((face) => ({
            time: event.timestamp ?? 0,
            value: face.Smile.Confidence,
          }))?.[0],
      )
      .filter(isDefined);

    return filteredEvents.sort((a, b) => a.time - b.time);
  }, [events]);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !smileTimeSeries) {
      return;
    }

    setChartData({
      labels: smileTimeSeries.map((field) => secondsToMMSS(field.time)),
      datasets: [
        {
          label: 'Eyes Open',
          borderColor: createGradient(chart.ctx, chart.chartArea),
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 4,
          data: smileTimeSeries.map((field) => field.value / 100),
        },
      ],
    });
  }, [smileTimeSeries]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Smile Chart
        </h3>
      </div>

      <Chart
        type="line"
        options={{
          devicePixelRatio: 4,
        }}
        className="grow shrink-0 w-full"
        data={chartData}
        ref={chartRef}
      />
    </div>
  );
}
