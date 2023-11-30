'use client';

import { loremIpsum } from 'lorem-ipsum';
import { useRef, useContext, useEffect } from 'react';
import EventHub, { AddFunction } from './event-hub';
import { AnalyticsContext } from '@/context/analytics-context';

interface AnalysisEventsProps {
  className?: string;
}

export default function AnalysisEvents({ className }: AnalysisEventsProps) {
  const ref = useRef<null | AddFunction>(null);
  const { analysisEvents } = useContext(AnalyticsContext);

  const mockMessagesIntervalIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (mockMessagesIntervalIdRef.current !== undefined) {
      clearInterval(mockMessagesIntervalIdRef.current);
      mockMessagesIntervalIdRef.current = undefined;
    }

    mockMessagesIntervalIdRef.current = setInterval(() => {
      ref.current?.(loremIpsum());
    }, 1000);

    return () => {
      clearInterval(mockMessagesIntervalIdRef.current);
    };
  }, []);

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
    <EventHub className={className}>
      {(add: AddFunction) => {
        ref.current = add;
      }}
    </EventHub>
  );
}
