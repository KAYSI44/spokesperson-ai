'use client';

import { useRef, useContext, useEffect } from 'react';
import EventHub, { AddFunction } from './event-hub';
import { AnalyticsContext } from '@/context/analytics-context';

export default function AnalysisEvents() {
  const ref = useRef<null | AddFunction>(null);
  const { analysisEvents } = useContext(AnalyticsContext);

  useEffect(() => {
    if (analysisEvents.length >= 1) {
      const e = analysisEvents[0];
      const eventMessage = `
Transcription: ${e.transcription?.text.slice(0, 20) + '...' ?? 'NULL'}\n
Sentiment: ${e.sentiment?.sentiment ?? 'NULL'}\n`;
      ref.current?.(eventMessage);
    }
  }, [analysisEvents]);

  return (
    <EventHub>
      {(add: AddFunction) => {
        ref.current = add;
      }}
    </EventHub>
  );
}
