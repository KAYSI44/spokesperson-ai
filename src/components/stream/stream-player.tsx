'use client';

import axios from 'axios';
import { blobToBase64, cn } from '@/lib/utils';
import MuxVideo from '@mux/mux-video-react';
import { useEffect, useRef, useContext } from 'react';
import { AnalyticsContext } from '@/context/analytics-context';

interface StreamPlayerProps {
  className?: string;
}

export default function StreamPlayer({ className }: StreamPlayerProps) {
  const intervalId = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>();

  const { analyticsOn } = useContext(AnalyticsContext);
  const analyticsOnRef = useRef(analyticsOn);

  useEffect(() => {
    analyticsOnRef.current = analyticsOn;
  }, [analyticsOn]);

  useEffect(() => {
    // Clear existing interval if needed
    if (intervalId.current !== undefined) clearInterval(intervalId.current);

    // Start capturing frames periodically
    intervalId.current = setInterval(captureFrame, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId.current);
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
      url: `/api/analyze-face`,
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
        playbackId="8QTvPdOAQZKYCxXcAy1w2CQEVUdeRTCw5dGDO53eueE"
        metadata={{
          video_id: 'xKrgmNRHR0100FYLQIywxhkLJt3L00xBajwM3FaJs01okkA',
          video_title: 'Super Interesting Video',
          viewer_user_id: 'user-id-bc-789',
        }}
        streamType="on-demand"
        controls
        autoPlay
        muted
      />
    </div>
  );
}
