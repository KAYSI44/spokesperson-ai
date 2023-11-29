'use client';

import { type ReactNode } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { INTERVIEWEE_TOKEN, INTERVIEWER_TOKEN } from '@/lib/constants';
import useInterviewer from '@/hooks/use-interviewer';

interface RoomContextProps {
  children?: ReactNode;
}

export default function RoomContext({ children }: RoomContextProps) {
  const { isInterviewer } = useInterviewer();

  return (
    <LiveKitRoom
      serverUrl="wss://spokesperson-8xf1qdz4.livekit.cloud"
      token={isInterviewer ? INTERVIEWER_TOKEN : INTERVIEWEE_TOKEN}
      >
      {children}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
