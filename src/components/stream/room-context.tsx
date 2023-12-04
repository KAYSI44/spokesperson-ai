'use client';

import { useEffect, type ReactNode } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import useAccessToken from '@/hooks/use-access-token';
import { useLocalStorage } from 'usehooks-ts';
import useMeetingID from '@/hooks/use-meeting-id';

interface RoomContextProps {
  children?: ReactNode;
}

export default function RoomContext({ children }: RoomContextProps) {
  const { accessToken } = useAccessToken();

  const { meetingID } = useMeetingID();
  const [pastMeetings, setPastMeetings] = useLocalStorage<
    {
      meetingID: string;
      lastUsedUnixMS: number;
    }[]
  >('pastMeetings', []);

  useEffect(() => {
    if (
      meetingID !== undefined &&
      meetingID !== 'new' &&
      !pastMeetings.find((meeting) => meeting.meetingID === meetingID)
    ) {
      setPastMeetings((pastMeetings) => [
        ...pastMeetings,
        {
          meetingID,
          lastUsedUnixMS: Date.now(),
        },
      ]);
    }
  }, [meetingID]);

  return (
    <LiveKitRoom
      serverUrl="wss://spokesperson-8xf1qdz4.livekit.cloud"
      token={accessToken}
    >
      {children}
    </LiveKitRoom>
  );
}
