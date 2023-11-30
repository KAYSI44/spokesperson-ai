'use client';

import axios, { type AxiosResponse } from 'axios';
import { blobToBase64, cn } from '@/lib/utils';
import { useEffect, useRef, useContext, useState, useMemo } from 'react';
import { AnalysisEvent, AnalyticsContext } from '@/context/analytics-context';
import { RecordRTCPromisesHandler } from '@/third-party/RecordRTC';
import {
  FaceAnalysisOutput,
  KeyPhrasesAnalysisOutput,
  PiiAnalysisOutput,
  SaveFrameOutput,
  SentimentAnalysisOutput,
  ToxicityAnalysisOutput,
  TranscribeSpeechOutput,
} from '@/lib/dto';
import { TrackReference, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import ControlPanel from './control-panel';
import MuxVideo from '@mux/mux-video-react';
import { VideoTrack } from '@/patches/video-track';

interface StreamPlayerProps {
  className?: string;
  videoId: string;
  playbackId: string;
  analyticsIntervalMs: number;
  isInterviewerScreen?: boolean;
}

export default function StreamPlayer({
  className,
  videoId: mockVideoId,
  playbackId: mockPlaybackId,
  analyticsIntervalMs,
  isInterviewerScreen,
}: StreamPlayerProps) {
  const intervalId = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>();

  const recorderRef = useRef<RecordRTCPromisesHandler>();

  const { analyticsOn, addAnalysisEvent } = useContext(AnalyticsContext);
  const analyticsOnRef = useRef(analyticsOn);

  const [playbackId, setPlaybackId] = useState<string>();
  const [videoId, setVideoId] = useState<string>();

  const [isMock, toggleMock] = useState(true);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const remoteTrack = tracks.find((track) => !track.participant.isLocal);

  useEffect(() => {
    if (isMock) {
      setPlaybackId(mockPlaybackId);
      setVideoId(mockVideoId);
    } else {
      setPlaybackId(undefined);
      setVideoId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMock]);

  useEffect(() => {
    analyticsOnRef.current = analyticsOn && isInterviewerScreen === true;
  }, [analyticsOn, isInterviewerScreen]);

  useEffect(() => {
    // Clear existing interval if needed
    if (intervalId.current !== undefined) {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    }

    // Start capturing frames periodically
    intervalId.current = setInterval(async () => {
      startAudioCapture();
      await new Promise((resolve) => setTimeout(resolve, analyticsIntervalMs));
      captureFrame();
    }, analyticsIntervalMs + 100);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId.current);
      recorderRef.current?.stopRecording(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function captureFrame() {
    const video = videoRef.current;

    // Ensure the video element is loaded
    if (!video || !analyticsOnRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a blob
    const imageBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob)),
    );

    try {
      if (imageBlob === null) {
        throw new Error('Failed to capture video frame.');
      }

      // Convert the canvas content to base64
      const base64Data = await blobToBase64(imageBlob);
      await analyzeFrame(base64Data);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function analyzeFrame(base64Data: string) {
    const video = videoRef.current;

    if (!analyticsOnRef.current || video === undefined) return;
    const timestamp = video.currentTime;

    const analyzeReq = axios<FaceAnalysisOutput>({
      url: `/api/analyze/face`,
      method: 'POST',
      data: {
        image: base64Data,
      },
    });

    const saveReq = axios<SaveFrameOutput>({
      url: `/api/save`,
      method: 'POST',
      data: {
        image: base64Data,
      },
    });

    await analyzeSpeech(timestamp, saveReq, analyzeReq);
  }

  async function analyzeSpeech(
    timestamp: number,
    saveReq: Promise<AxiosResponse<SaveFrameOutput, any>>,
    faceAnalyzeReq: Promise<AxiosResponse<FaceAnalysisOutput, any>>,
  ) {
    const video = videoRef.current;
    if (recorderRef.current === undefined || video === undefined) return;

    const blob = await new Promise<Blob>(
      (resolve) => recorderRef.current?.stopRecording((blob) => resolve(blob)),
    );

    const base64Data = await blobToBase64(blob);

    if (base64Data.length === 0 || !analyticsOnRef.current) return;

    const transcribeReq = axios<TranscribeSpeechOutput>({
      url: `/api/speech`,
      method: 'POST',
      data: {
        audio: base64Data,
      },
    });

    const [{ data: transcribeData, status: transcribeStatus }] =
      await Promise.all([transcribeReq]);

    const transcribedText = transcribeData?.result?.text ?? '';

    if (transcribeStatus != 200) {
      throw new Error(transcribeData?.error?.message ?? 'An error occured');
    }

    // After transcribing the speech, perform analysis operations, analyze image frame
    const sentimentReq = axios<SentimentAnalysisOutput>({
      url: `/api/analyze/sentiment`,
      method: 'POST',
      data: {
        text: transcribedText,
      },
    });

    const toxicityReq = axios<ToxicityAnalysisOutput>({
      url: `/api/analyze/toxic`,
      method: 'POST',
      data: {
        text: transcribedText,
      },
    });

    const piiReq = axios<PiiAnalysisOutput>({
      url: `/api/analyze/pii`,
      method: 'POST',
      data: {
        text: transcribedText,
      },
    });

    const keyPhrasesReq = axios<KeyPhrasesAnalysisOutput>({
      url: `/api/analyze/key-phrases`,
      method: 'POST',
      data: {
        text: transcribedText,
      },
    });

    const [
      { data: sentimentData, status: sentimentStatus },
      { data: toxicityData, status: toxicityStatus },
      { data: piiData, status: piiStatus },
      { data: keyPhrasesData, status: keyPhrasesStatus },
      { data: saveData, status: saveStatus },
      { data: faceAnalyzeData, status: analyzeStatus },
    ] = await Promise.all([
      sentimentReq,
      toxicityReq,
      piiReq,
      keyPhrasesReq,
      saveReq,
      faceAnalyzeReq,
    ]);

    if (saveStatus !== 200 || saveData.result === undefined) {
      throw new Error(saveData?.error?.message ?? 'An error occured');
    }

    if (analyzeStatus !== 200 || faceAnalyzeData.result === undefined) {
      throw new Error(faceAnalyzeData?.error?.message ?? 'An error occured');
    }

    if (sentimentStatus !== 200 || sentimentData.result === undefined) {
      throw new Error(sentimentData?.error?.message ?? 'An error occured');
    }

    if (toxicityStatus !== 200 || toxicityData.result === undefined) {
      throw new Error(toxicityData?.error?.message ?? 'An error occured');
    }

    if (piiStatus !== 200 || piiData.result === undefined) {
      throw new Error(piiData?.error?.message ?? 'An error occured');
    }

    if (keyPhrasesStatus !== 200 || keyPhrasesData.result === undefined) {
      throw new Error(keyPhrasesData?.error?.message ?? 'An error occured');
    }

    const event = {
      timestamp,
      pii: piiData.result,
      storedFrame: saveData.result,
      toxicity: toxicityData.result,
      sentiment: sentimentData.result,
      keyPhrases: keyPhrasesData.result,
      transcription: transcribeData.result,
      faceAnalysis: faceAnalyzeData.result,
    } as AnalysisEvent;

    addAnalysisEvent(event);
  }

  async function startAudioCapture() {
    const video = videoRef.current;

    // Ensure the video element is loaded
    if (!video) return;

    const videoStream = (video as unknown as HTMLCanvasElement).captureStream();
    const audioTrack = videoStream.getAudioTracks()[0];

    if (!audioTrack) return;

    const audioStream = new MediaStream();
    audioStream.addTrack(audioTrack);

    recorderRef.current = new RecordRTCPromisesHandler(audioStream, {
      mimeType: 'audio/wav',
      disableLogs: true,
      type: 'audio',
    });

    await recorderRef.current.startRecording();
  }

  return (
    <div
      className={cn(
        className,
        'w-full h-full mx-auto p-1 border border-muted rounded-lg overflow-hidden',
        !isInterviewerScreen &&
          'border-green-500 shadow-lg shadow-green-500/10 border-2',
      )}
    >
      <ControlPanel isMock={isMock} toggleMock={toggleMock} />
      {isMock && (
        <MuxVideo
          ref={videoRef}
          className="w-full h-full object-cover"
          playbackId={playbackId}
          metadata={{
            video_id: videoId,
            video_title: 'Super Interesting Video',
            viewer_user_id: 'user-id-bc-789',
          }}
          streamType="on-demand"
          controls
          autoPlay={false}
          muted={false}
        />
      )}

      {!isMock && remoteTrack && (
        <VideoTrack
          mediaEl={videoRef}
          className="w-full h-full object-cover"
          trackRef={remoteTrack as TrackReference}
        />
      )}
    </div>
  );
}
