'use client';

import { type CSSProperties } from 'react';
import { type BoundingBox as BoundingBoxType } from '@/lib/dto';

interface BoundingBoxProps {
  boundingBox: BoundingBoxType;
}

export default function BoundingBox({ boundingBox }: BoundingBoxProps) {
  const { Height, Left, Top, Width } = boundingBox;

  // Calculate the styles for the square based on the bounding box dimensions
  const squareStyles: CSSProperties = {
    position: 'absolute',
    top: `${Top * 100}%`,
    left: `${Left * 100}%`,
    width: `${Width * 100}%`,
    height: `${Height * 100}%`,
    boxSizing: 'border-box',
  };

  return (
    <div className="absolute inset-0">
      <div style={squareStyles} className="border-2 border-blue-600"></div>
    </div>
  );
}
