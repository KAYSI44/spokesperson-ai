'use client';

import { createContext, useState, type ReactNode } from 'react';
import {
  FaceAnalysisOutput,
  KeyPhrasesAnalysisOutput,
  PiiAnalysisOutput,
  SaveFrameOutput,
  SentimentAnalysisOutput,
  ToxicityAnalysisOutput,
  TranscribeSpeechOutput,
} from '@/lib/dto';

export const AnalyticsContext = createContext({
  analyticsOn: false,
  toggleAnalytics: (_: boolean) => {},

  analysisEvents: [] as AnalysisEvent[],
  addAnalysisEvent: (_: AnalysisEvent) => {},
});

interface AnalysisEvent {
  timestamp: number;
  pii: PiiAnalysisOutput['result'];
  storedFrame: SaveFrameOutput['result'];
  toxicity: ToxicityAnalysisOutput['result'];
  faceAnalysis: FaceAnalysisOutput['result'];
  sentiment: SentimentAnalysisOutput['result'];
  keyPhrases: KeyPhrasesAnalysisOutput['result'];
  transcription: TranscribeSpeechOutput['result'];
}

interface AnalyticsProviderProps {
  children?: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  const [analyticsOn, toggleAnalytics] = useState(false);
  const [analysisEvents, setAnalysisEvents] = useState<AnalysisEvent[]>([]);

  function addAnalysisEvent(event: AnalysisEvent) {
    setAnalysisEvents((events) => [event, ...events]);
  }

  return (
    <AnalyticsContext.Provider
      value={{ analyticsOn, toggleAnalytics, analysisEvents, addAnalysisEvent }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
