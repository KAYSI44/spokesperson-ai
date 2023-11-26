'use client'

import { loremIpsum } from 'lorem-ipsum';
import { useRef } from 'react';
import EventHub, { AddFunction } from './event-hub';

export default function AnalysisEvents() {
  const ref = useRef<null | AddFunction>(null);

  const handleClick = () => {
    ref.current?.(loremIpsum());
  };

  return (
    <div onClick={handleClick} className="cursor-pointer text-[#676767] select-none flex items-center justify-center bg-muted rounded-sm w-full h-full">
      Click here to create notifications
      <EventHub>
        {(add: AddFunction) => {
          ref.current = add;
        }}
      </EventHub>
    </div>
  );
}
