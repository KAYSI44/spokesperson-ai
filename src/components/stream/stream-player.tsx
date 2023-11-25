'use client';

import { cn } from '@/lib/utils';
import MuxVideo from '@mux/mux-video-react';
import { useEffect, useRef } from 'react';

interface StreamPlayerProps {
  className?: string;
}

export default function StreamPlayer({ className }: StreamPlayerProps) {
  const intervalId = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const video = videoRef.current;

    // Ensure the video element is loaded
    if (!video) return;

    // Clear existing interval if needed
    if (intervalId.current !== undefined) clearInterval(intervalId.current);

    const captureFrame = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to base64
      const base64Data = canvas.toDataURL('image/jpeg');
    };

    // Start capturing frames periodically
    intervalId.current = setInterval(captureFrame, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId.current);
  }, []);

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
        playbackId="DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"
        metadata={{
          video_id: 'video-id-123456',
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
