'use client';

import { type ReactNode } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import useAccessToken from '@/hooks/use-access-token';

interface RoomContextProps {
  children?: ReactNode;
}

export default function RoomContext({ children }: RoomContextProps) {
  const { accessToken } = useAccessToken();

  return (
    <LiveKitRoom
      serverUrl="wss://spokesperson-8xf1qdz4.livekit.cloud"
      token={accessToken}
    >
      {children}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
