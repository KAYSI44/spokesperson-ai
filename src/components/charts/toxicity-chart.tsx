'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { Chart as ChartJS, type ChartData, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { secondsToMMSS } from '@/lib/utils';
import { createGradient } from '@/lib/charts';

ChartJS.register(...registerables);

export default function ToxicityChart() {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const toxicityTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map(
        (event) =>
          event?.toxicity?.map((toxicity) => ({
            time: event.timestamp,
            value: toxicity.toxicity,
          }))?.[0],
      )
      .filter((event) => !!event) as { time: number; value: number }[];

    return filteredEvents.sort((a, b) =>
      a?.time > b?.time ? 1 : a?.time < b?.time ? -1 : 0,
    );
  }, [events]);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !toxicityTimeSeries) {
      return;
    }

    setChartData({
      labels: toxicityTimeSeries.map((field) => secondsToMMSS(field.time)),
      datasets: [
        {
          label: 'Toxicity',
          borderColor: createGradient(chart.ctx, chart.chartArea),
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 4,
          data: toxicityTimeSeries.map((field) => field.value / 100),
        },
      ],
    });
  }, [toxicityTimeSeries]);

  return (
    <div className="w-full aspect-video bg-muted/50 p-6 rounded-xl flex flex-col">
      <div className="mb-4 flex justify-between items-center shrink-0 grow-0">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Toxicity Chart
        </h3>
      </div>

      <Chart
        options={{ devicePixelRatio: 4 }}
        className="grow shrink-0 w-full"
        data={chartData}
        ref={chartRef}
        type="line"
      />
    </div>
  );
}
