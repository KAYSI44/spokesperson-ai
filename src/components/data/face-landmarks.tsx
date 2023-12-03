'use client';

import { type CSSProperties } from 'react';
import { FaceLandmark } from '@/lib/dto';

interface FaceLandmarksProps {
  landmarks: FaceLandmark[];
}

export default function FaceLandmarks({ landmarks }: FaceLandmarksProps) {
  const landmarkStylesAccessor = (X: number, Y: number) =>
    ({
      position: 'absolute',
      top: `${Y * 100}%`,
      left: `${X * 100}%`,
      transform: 'translate(-50%, -50%)', // Center the landmark on its position
    }) as CSSProperties;

  return (
    <div className="absolute inset-0">
      {landmarks.map((landmark) => (
        <div
          key={landmark.Type}
          style={landmarkStylesAccessor(landmark.X, landmark.Y)}
          className="w-1 h-1 rounded-full bg-red-600"
        ></div>
      ))}
    </div>
  );
}
