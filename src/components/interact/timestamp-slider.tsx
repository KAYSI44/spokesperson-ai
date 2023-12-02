'use client';

import styles from '@/styles/timestamp-slider.module.scss';
import { ReviewContext } from '@/context/review-context';
import { cn } from '@/lib/utils';
import { useState, useEffect, useContext } from 'react';
import useReviewData from '@/hooks/use-review-data';
import useMeetingID from '@/hooks/use-meeting-id';

interface TimestampSliderProps {
  sliderPadding?: number;
}

export default function TimestampSlider({
  sliderPadding = 3,
}: TimestampSliderProps) {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const timestamps = events?.map((event) => event.timestamp) ?? [];

  const { currentTimestamp, setCurrentTimestamp } = useContext(ReviewContext);
  const [sliderValue, setSliderValue] = useState(timestamps[0] ?? 0);

  const minTimestamp = Math.min(...timestamps) - sliderPadding;
  const maxTimestamp = Math.max(...timestamps) + sliderPadding;

  const normalizeValue = (value: number) =>
    (value - minTimestamp) / (maxTimestamp - minTimestamp);

  useEffect(() => {
    if (!timestamps.length) return;

    const closestTimestamp = timestamps.reduce((prev, curr) =>
      Math.abs(curr - sliderValue) < Math.abs(prev - sliderValue) ? curr : prev,
    );

    setCurrentTimestamp(closestTimestamp);
  }, [sliderValue]);

  return (
    <div className="w-[300px] relative">
      <input
        type="range"
        step="0.001"
        min={minTimestamp}
        max={maxTimestamp}
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.valueAsNumber)}
        className={cn('w-full h-full', styles['slider'])}
      />
      <div className="w-full pointer-events-none">
        {timestamps.map((timestamp) => (
          <div
            key={timestamp}
            className={cn(
              'w-1 h-3 absolute top-[22px] bg-blue-500 transition-opacity',
              currentTimestamp === timestamp ? 'opacity-0' : 'opacity-50',
            )}
            style={{
              left: `${normalizeValue(timestamp) * 100}%`,
            }}
          />
        ))}
      </div>
      <p
        className="absolute -bottom-6 transform -translate-x-1/2 font-light text-xs text-white"
        style={{
          left: `${normalizeValue(sliderValue) * 100}%`,
        }}
      >
        {sliderValue.toFixed(2)}
      </p>
    </div>
  );
}
