import { AnalysisEvent } from '@/context/analytics-context';
import {
  PiiEntityType,
  SentimentType,
  ToxicContentType,
} from '@aws-sdk/client-comprehend';

export interface BoundingBox {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}

interface FaceAnalysis {
  BoundingBox: BoundingBox;
  Confidence: number;
  Emotions: {
    Confidence: number;
    Type: string;
  }[];
  EyeDirection: {
    Confidence: number;
    Pitch: number;
    Yaw: number;
  };
  EyesOpen: {
    Confidence: number;
    Value: boolean;
  };
  Gender: {
    Confidence: number;
    Value: string;
  };
  Landmarks: {
    Type: string;
    X: number;
    Y: number;
  }[];
  Pose: {
    Pitch: number;
    Roll: number;
    Yaw: number;
  };
  Quality: {
    Brightness: number;
    Sharpness: number;
  };
  Smile: {
    Confidence: number;
    Value: boolean;
  };
}

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
  result?: FaceAnalysis[];
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
