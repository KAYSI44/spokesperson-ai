'use client';

import { AlertCircleIcon } from 'lucide-react';
import styles from '@/styles/timestamp-slider.module.scss';
import { ReviewContext } from '@/context/review-context';
import { cn, secondsToMMSS } from '@/lib/utils';
import { useState, useEffect, useContext, useMemo } from 'react';
import useReviewData from '@/hooks/use-review-data';
import useMeetingID from '@/hooks/use-meeting-id';
import { TOXICITY_THRESHOLD } from '@/lib/constants';
import { isDefined } from '@/lib/typing';

interface TimestampSliderProps {
  sliderPadding?: number;
  className?: string;
}

export default function TimestampSlider({
  className,
  sliderPadding = 3,
}: TimestampSliderProps) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const timestamps =
    events
      ?.map((event) => event.timestamp)
      .filter(isDefined)
      .sort((a, b) => a - b) ?? [];

  const toxicityTimeSeries = useMemo(() => {
    if (!events) return undefined;

    const filteredEvents = events
      .map(
        (event) =>
          event.toxicity?.map((toxicity) => ({
            time: event.timestamp,
            value: toxicity.toxicity,
          }))?.[0],
      )
      .filter(isDefined);

    return filteredEvents.sort((a, b) => a.time - b.time);
  }, [events]);

  const { currentTimestamp, setCurrentTimestamp } = useContext(ReviewContext);
  const [sliderValue, setSliderValue] = useState(timestamps[0] ?? 0);

  const minTimestamp = Math.max(0, Math.min(...timestamps) - sliderPadding);
  const maxTimestamp = Math.max(...timestamps) + sliderPadding;

  const normalizeValue = (value: number) =>
    (value - minTimestamp) / (maxTimestamp - minTimestamp);

  useEffect(() => {
    if (!timestamps.length) return;

    const closestTimestamp = timestamps.reduce((prev, curr) =>
      Math.abs(curr - sliderValue) < Math.abs(prev - sliderValue) ? curr : prev,
    );

    setCurrentTimestamp(closestTimestamp);
  }, [sliderValue, timestamps]);

  return (
    <div className={cn('w-[300px] relative', className)}>
      <input
        type="range"
        step="0.001"
        min={minTimestamp}
        max={maxTimestamp}
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.valueAsNumber)}
        className={cn('w-full h-full cursor-w-resize', styles['slider'])}
      />
      <div className="w-full pointer-events-none">
        {timestamps.map((timestamp) => (
          <div
            key={timestamp}
            className={cn(
              'w-1 h-3 absolute -bottom-[2.5px] bg-blue-500 transform -translate-x-1/2 transition-opacity',
              currentTimestamp === timestamp ? 'opacity-0' : 'opacity-50',
            )}
            style={{
              left: `${normalizeValue(timestamp) * 100}%`,
            }}
          />
        ))}
        {toxicityTimeSeries &&
          toxicityTimeSeries.map((toxicity) => (
            <div
              key={toxicity.time}
              className={cn(
                'w-4 h-4 rounded-full absolute p-[2px] subpixel-antialiased pt-[3px] bottom-0 transform -translate-y-1/2 -translate-x-1/2 bg-red-500 transition-opacity before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-red-500',
                currentTimestamp === toxicity.time ||
                  toxicity.value < TOXICITY_THRESHOLD
                  ? 'opacity-0'
                  : 'opacity-100',
              )}
              style={{
                left: `${normalizeValue(toxicity.time) * 100}%`,
              }}
            >
              <AlertCircleIcon className="w-full h-full stroke-white" />
            </div>
          ))}
      </div>
      <p
        className="absolute pointer-events-none -bottom-4 transform -translate-x-1/2 font-light text-xs text-white"
        style={{
          left: `${normalizeValue(sliderValue) * 100}%`,
        }}
      >
        {secondsToMMSS(sliderValue)}
      </p>
    </div>
  );
}
