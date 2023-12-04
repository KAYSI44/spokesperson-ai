'use client';

import axios from 'axios';
import { createContext, useState, type ReactNode } from 'react';
import {
  AnalyticsInput,
  AnalyticsOutput,
  FaceAnalysisOutput,
  KeyPhrasesAnalysisOutput,
  PiiAnalysisOutput,
  SaveFrameOutput,
  SentimentAnalysisOutput,
  ToxicityAnalysisOutput,
  TranscribeSpeechOutput,
} from '@/lib/dto';
import useMeetingID from '@/hooks/use-meeting-id';

export const AnalyticsContext = createContext({
  analyticsOn: false,
  toggleAnalytics: (_: boolean) => {},

  analysisEvents: [] as AnalysisEvent[],
  addAnalysisEvent: (_: AnalysisEvent) => {},
});

export interface AnalysisEvent {
  timestamp?: number;
  pii?: PiiAnalysisOutput['result'];
  storedFrame?: SaveFrameOutput['result'];
  toxicity?: ToxicityAnalysisOutput['result'];
  faceAnalysis?: FaceAnalysisOutput['result'];
  sentiment?: SentimentAnalysisOutput['result'];
  keyPhrases?: KeyPhrasesAnalysisOutput['result'];
  transcription?: TranscribeSpeechOutput['result'];
}

interface AnalyticsProviderProps {
  children?: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  const { meetingID } = useMeetingID();
  const [analyticsOn, toggleAnalytics] = useState(false);
  const [analysisEvents, setAnalysisEvents] = useState<AnalysisEvent[]>([]);

  async function addAnalysisEvent(event: AnalysisEvent) {
    setAnalysisEvents((events) => [event, ...events]);

    await axios<AnalyticsOutput>({
      url: `/api/analytics/${meetingID}`,
      method: 'POST',
      data: { event } as AnalyticsInput,
    });
  }

  return (
    <AnalyticsContext.Provider
      value={{ analyticsOn, toggleAnalytics, analysisEvents, addAnalysisEvent }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
