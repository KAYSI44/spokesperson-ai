'use client';

import Image from 'next/image';
import { ScanFaceIcon } from 'lucide-react';
import { useContext, useState, useMemo } from 'react';
import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import BoundingBox from './bounding-box';
import FaceLandmarks from './face-landmarks';

interface CurrentFrameProps {
  className?: string;
}

export default function CurrentFrame({ className }: CurrentFrameProps) {
  const [faceFocused, toggleFaceFocused] = useState(false);

  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);
  const { currentTimestamp } = useContext(ReviewContext);

  const frames = events?.map((event) => event.storedFrame?.uri as string);

  const currentFrame = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    return currentEvent?.storedFrame?.uri;
  }, [currentTimestamp, events]);

  const faceBoundingBox = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    const boundingBoxes = currentEvent?.faceAnalysis?.map(
      (face) => face.BoundingBox,
    );

    return boundingBoxes?.[0];
  }, [currentTimestamp, events]);

  const faceLandmarks = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    const landmarks = currentEvent?.faceAnalysis?.map((face) => face.Landmarks);

    return landmarks?.[0];
  }, [currentTimestamp, events]);

  return (
    <div className="p-6 rounded-lg bg-muted/50 overflow-hidden w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Interviewee
        </h3>

        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="default"
                className={cn(faceFocused && 'bg-muted/80')}
                pressed={faceFocused}
                onPressedChange={(state) => toggleFaceFocused(state)}
              >
                <ScanFaceIcon className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Focus Face</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        className={cn(
          'w-[48rem] h-[28rem] relative border border-muted-foreground',
          className,
        )}
      >
        {frames &&
          frames.map((uri) => (
            <Image
              key={uri}
              src={uri}
              alt=""
              fill
              priority
              className={cn(
                'object-cover transition-opacity',
                uri !== currentFrame ? 'opacity-0' : 'opacity-100',
              )}
            />
          ))}

        {faceFocused && (
          <div className="w-full h-full">
            {faceBoundingBox && <BoundingBox boundingBox={faceBoundingBox} />}

            {faceLandmarks && <FaceLandmarks landmarks={faceLandmarks} />}
          </div>
        )}
      </div>
    </div>
  );
}
