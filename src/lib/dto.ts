import { AnalysisEvent } from '@/context/analytics-context';
import {
  PiiEntityType,
  SentimentType,
  ToxicContentType,
} from '@aws-sdk/client-comprehend';

interface ErrorOutput {
  error?: {
    message: string;
  };
}

export type SaveFrameOutput = {
  result?: {
    uri: string;
  };
} & ErrorOutput;

export type FaceAnalysisOutput = {
  result?: any;
} & ErrorOutput;

export type TranscribeSpeechOutput = {
  result?: {
    text: string;
  };
} & ErrorOutput;

export type SentimentAnalysisOutput = {
  result?: {
    sentiment: SentimentType;
  };
} & ErrorOutput;

export type ToxicityAnalysisOutput = {
  result?: {
    toxicity: number;
    value: ToxicContentType[];
  }[];
} & ErrorOutput;

export type PiiAnalysisOutput = {
  result?: {
    type: PiiEntityType;
    value: string;
  }[];
} & ErrorOutput;

export type KeyPhrasesAnalysisOutput = {
  result?: {
    keyPhrases: string[];
  };
} & ErrorOutput;

export type AccessTokenOutput = {
  result?: {
    token: string;
  };
} & ErrorOutput;

export interface AnalyticsInput {
  event: AnalysisEvent;
}

export type AnalyticsOutput = {
  result?: {};
} & ErrorOutput;

export type ReviewOutput = {
  result?: {
    events: AnalysisEvent[];
  };
} & ErrorOutput;
