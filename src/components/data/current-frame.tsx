'use client';

import Image from 'next/image';
import { ScanFaceIcon } from 'lucide-react';
import { useContext, useState, useMemo } from 'react';
import { ReviewContext } from '@/context/review-context';
import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { cn, sigmoid } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import BoundingBox from './bounding-box';
import FaceLandmarks from './face-landmarks';
import EyeDirection from './eye-direction';
import {
  EYES_OPEN_WEIGHT,
  EYE_DIRECTION_WEIGHT,
  PITCH_THRESHOLD,
  SIGMOID_STEEPNESS,
  YAW_THRESHOLD,
} from '@/lib/constants';

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

  const eyeDirection = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    const directions = currentEvent?.faceAnalysis?.map(
      (face) => face.EyeDirection,
    );

    return directions?.[0];
  }, [currentTimestamp, events]);

  const eyesOpen = useMemo(() => {
    const currentEvent = events?.find(
      (event) => event.timestamp === currentTimestamp,
    );
    const scores = currentEvent?.faceAnalysis?.map((face) => face.EyesOpen);

    return scores?.[0];
  }, [currentTimestamp, events]);

  const awarenessScore = useMemo(() => {
    if (!eyeDirection || !eyesOpen) return;

    const { Pitch, Yaw } = eyeDirection;
    const { Confidence } = eyesOpen;

    // Calculate awareness based on pitch and yaw
    const awarenessPitch = sigmoid(
      Math.abs(Pitch) - PITCH_THRESHOLD,
      SIGMOID_STEEPNESS,
    );
    const awarenessYaw = sigmoid(
      Math.abs(Yaw) - YAW_THRESHOLD,
      SIGMOID_STEEPNESS,
    );

    // Blend the awareness values, with weights for eye direction and eyes open
    const awarenessMetric =
      (((awarenessPitch + awarenessYaw) / 2) * EYE_DIRECTION_WEIGHT +
        Confidence * EYES_OPEN_WEIGHT) /
      (EYE_DIRECTION_WEIGHT + EYES_OPEN_WEIGHT);

    return awarenessMetric;
  }, [eyesOpen, eyeDirection]);

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

        {faceFocused && (
          <div className="w-1/3 absolute top-0 left-0 m-2 py-4 bg-muted/50">
            {eyeDirection && (
              <EyeDirection
                className="w-full aspect-video"
                eyeDirection={eyeDirection}
              />
            )}
            <p className="text-xs text-blue-500 font-semibold ml-4">
              Eyes Open:{' '}
              <span>
                {eyesOpen !== undefined
                  ? `${Math.round(eyesOpen.Confidence * 100) / 100}%`
                  : 'NIL'}
              </span>
            </p>
            <p className="text-xs mt-2 text-blue-500 font-semibold ml-4">
              Awareness Score:{' '}
              <span>
                {awarenessScore !== undefined
                  ? `${Math.round(awarenessScore * 100) / 100}%`
                  : 'NIL'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
