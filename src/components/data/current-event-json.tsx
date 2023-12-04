'use client';

import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';
import { useContext, useMemo } from 'react';
import ReactJson from 'react-json-view';
import { Button } from '../ui/button';
import { BracesIcon } from 'lucide-react';

export default function CurrentEventJSON({
  className,
}: {
  className?: string;
}) {
  const { meetingID } = useMeetingID();
  const { currentTimestamp } = useContext(ReviewContext);
  const { events } = useReviewData(meetingID);

  const currentJSON = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event?.timestamp === currentTimestamp,
    );
    if (!currentEvent) return undefined;

    return currentEvent;
  }, [events, currentTimestamp]);

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Event JSON
        </h3>
      </div>

      <Button variant="ghost" className="mb-4">
        <BracesIcon className="w-4 h-4 mr-2 mb-0.5" />
        <span>Export to JSON</span>
      </Button>

      {currentJSON ? (
        <div className="bg-muted/80 p-4 rounded-sm">
          <ReactJson src={currentJSON} theme={'apathy'} collapsed />
        </div>
      ) : (
        <p>NIL</p>
      )}
    </div>
  );
}
