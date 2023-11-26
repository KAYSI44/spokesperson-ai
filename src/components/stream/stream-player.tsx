'use client';

import axios from 'axios';
import { blobToBase64, cn } from '@/lib/utils';
import MuxVideo from '@mux/mux-video-react';
import { useEffect, useRef, useContext } from 'react';
import { AnalyticsContext } from '@/context/analytics-context';
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

interface StreamPlayerProps {
  className?: string;
  videoId: string;
  playbackId: string;
}

export default function StreamPlayer({
  className,
  videoId,
  playbackId,
}: StreamPlayerProps) {
  const intervalId = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>();

  const recorderRef = useRef<RecordRTCPromisesHandler>();

  const { analyticsOn } = useContext(AnalyticsContext);
  const analyticsOnRef = useRef(analyticsOn);

  useEffect(() => {
    analyticsOnRef.current = analyticsOn;
  }, [analyticsOn]);

  useEffect(() => {
    // Clear existing interval if needed
    if (intervalId.current !== undefined) clearInterval(intervalId.current);

    // Start capturing frames periodically
    intervalId.current = setInterval(() => {
      // captureFrame();
      analyzeSpeech();
      startAudioCapture();
    }, 5000);

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
    if (!video) return;

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
    if (!analyticsOnRef.current) return;

    const analyzeReq = axios<FaceAnalysisOutput>({
      url: `/api/analyze/face`,
      method: 'POST',
      data: {
        image: base64Data,
      },
    });

    const saveReq = axios<SaveFrameOutput>({
      url: `/api/analyze/face`,
      method: 'POST',
      data: {
        image: base64Data,
      },
    });

    const [
      { data: saveData, status: saveStatus },
      { data: analyzeData, status: analyzeStatus },
    ] = await Promise.all([saveReq, analyzeReq]);

    if (saveStatus !== 200) {
      throw new Error(saveData?.error?.message ?? 'An error occured');
    }

    if (analyzeStatus !== 200) {
      throw new Error(analyzeData?.error?.message ?? 'An error occured');
    }
  }

  async function analyzeSpeech() {
    if (recorderRef.current === undefined) return;

    // const blob = await new Promise<Blob>(
    //   (resolve) => recorderRef.current?.stopRecording((blob) => resolve(blob)),
    // );

    // const base64Data = await blobToBase64(blob);

    if (/*base64Data.length === 0 ||*/ !analyticsOnRef.current) return;

    // const transcribeReq = axios<TranscribeSpeechOutput>({
    //   url: `/api/speech`,
    //   method: 'POST',
    //   data: {
    //     audio: base64Data,
    //   },
    // });

    // const [{ data: transcribeData, status: transcribeStatus }] =
    //   await Promise.all([transcribeReq]);

    // const transcribedText = transcribeData?.result?.text ?? '';

    // if (transcribeStatus != 200) {
    //   throw new Error(transcribeData?.error?.message ?? 'An error occured');
    // }

    const transcribedText =
      'Connor, thank you very much for doing this. Can you describe the emotions after a lost?';

    // After transcribing the speech, perform analysis operations
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
    ] = await Promise.all([sentimentReq, toxicityReq, piiReq, keyPhrasesReq]);

    if (sentimentStatus !== 200) {
      throw new Error(sentimentData?.error?.message ?? 'An error occured');
    }

    if (toxicityStatus !== 200) {
      throw new Error(toxicityData?.error?.message ?? 'An error occured');
    }

    if (piiStatus !== 200) {
      throw new Error(piiData?.error?.message ?? 'An error occured');
    }

    if (keyPhrasesStatus !== 200) {
      throw new Error(keyPhrasesData?.error?.message ?? 'An error occured');
    }

    console.log({ sentimentData, toxicityData, piiData, keyPhrasesData });
  }

  async function startAudioCapture() {
    const video = videoRef.current;

    // Ensure the video element is loaded
    if (!video) return;

    const videoStream = (video as unknown as HTMLCanvasElement).captureStream();
    const audioTrack = videoStream.getAudioTracks()[0];

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
        'w-full h-full mx-auto mt-8 p-1 border border-muted rounded-lg overflow-hidden',
      )}
    >
      <MuxVideo
        ref={videoRef}
        className="w-full h-full"
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
    </div>
  );
}
