import { AnalysisEvent } from '@/context/analytics-context';
import {
  PiiEntityType,
  SentimentType,
  ToxicContentType,
} from '@aws-sdk/client-comprehend';
import {
  LandmarkType,
  EmotionName,
  GenderType,
} from '@aws-sdk/client-rekognition';

export interface BoundingBox {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}

export interface FaceLandmark {
  Type: LandmarkType;
  X: number;
  Y: number;
}

export interface EyeDirection {
  Confidence: number;
  Pitch: number;
  Yaw: number;
}

interface FaceAnalysis {
  BoundingBox: BoundingBox;
  Confidence: number;
  Emotions: {
    Confidence: number;
    Type: EmotionName;
  }[];
  EyeDirection: EyeDirection;
  EyesOpen: {
    Confidence: number;
    Value: boolean;
  };
  Gender: {
    Confidence: number;
    Value: GenderType;
  };
  Landmarks: FaceLandmark[];
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

export interface FlagInput {
  event: AnalysisEvent;
}

export type AnalyticsOutput = {
  result?: {};
} & ErrorOutput;

export type ReviewOutput = {
  result?: {
    events: (AnalysisEvent | undefined)[];
  };
} & ErrorOutput;

export type OverallReportOutput = {
  result?: {
    mostDiscussedTopic: {
      topic: string;
      description: string;
    };
    overallSentiment: {
      sentiment: SentimentType;
      description: string;
    };
    topicsDiscussed: {
      topic: string;
      sentiment: SentimentType;
    }[];
    questionsAsked: string[];
    suggestions: string[];
  };
} & ErrorOutput;

export interface EndMeetingEvent {
  data: OverallReportOutput['result'];
}
