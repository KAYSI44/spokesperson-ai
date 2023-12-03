'use client';

import { useContext, useMemo } from 'react';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';
import { ReviewContext } from '@/context/review-context';
import {
  TOXICITY_DANGER_THRESHOLD,
  TOXICITY_MID_THRESHOLD,
  TOXICITY_THRESHOLD,
} from '@/lib/constants';

export default function ToxicityIndicator({
  className,
}: {
  className?: string;
}) {
  const { currentTimestamp } = useContext(ReviewContext);

  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const toxicityData = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    const scores = currentEvent?.toxicity;

    console.log(scores);

    return scores?.[0];
  }, [currentTimestamp, events]);

  return (
    <div className={cn('p-6 rounded-lg bg-muted/50', className)}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">Toxicity</h3>
      </div>

      {toxicityData ? (
        toxicityData.toxicity > TOXICITY_THRESHOLD ? (
          <div className="space-y-1">
            <p
              className={cn(
                'font-semibold text-xs',
                toxicityData.toxicity > TOXICITY_DANGER_THRESHOLD
                  ? 'text-red-500'
                  : toxicityData.toxicity > TOXICITY_MID_THRESHOLD
                    ? 'text-orange-500'
                    : 'text-green-500',
              )}
            >
              Probability: {Math.round(toxicityData.toxicity * 100) / 100}% (
              {toxicityData.toxicity > TOXICITY_DANGER_THRESHOLD
                ? 'HIGH'
                : toxicityData.toxicity > TOXICITY_MID_THRESHOLD
                  ? 'MID'
                  : 'LOW'}
              )
            </p>
            <p className="font-semibold text-xs">
              Categories: {toxicityData.value.join(' | ')}
            </p>
          </div>
        ) : (
          <p className="font-semibold text-sm text-green-500">
            No toxicity detected.
          </p>
        )
      ) : (
        <p>NIL</p>
      )}
    </div>
  );
}
