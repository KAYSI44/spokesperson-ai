'use client';

import axios from 'axios';
import { blobToBase64, cn } from '@/lib/utils';
import MuxVideo from '@mux/mux-video-react';
import { useEffect, useRef, useContext } from 'react';
import { AnalyticsContext } from '@/context/analytics-context';
import { RecordRTCPromisesHandler } from '@/third-party/RecordRTC';

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

    const { data, status } = await axios({
      url: `/api/analyze/face`,
      method: 'POST',
      data: {
        image: base64Data,
      },
    });

    if (status != 200) {
      throw new Error(data?.error?.message ?? 'An error occured');
    }

    console.log(data);
  }

  async function analyzeSpeech() {
    if (recorderRef.current === undefined) return;

    const blob = await new Promise<Blob>(
      (resolve) => recorderRef.current?.stopRecording((blob) => resolve(blob)),
    );

    const base64Data = await blobToBase64(blob);

    if (base64Data.length === 0 || !analyticsOnRef.current) return;

    const { data, status } = await axios({
      url: `/api/tts`,
      method: 'POST',
      data: {
        audio: base64Data,
      },
    });

    const transcribedText = data?.result?.text ?? '';
    console.log({ transcribedText });

    if (status != 200) {
      throw new Error(data?.error?.message ?? 'An error occured');
    }
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
