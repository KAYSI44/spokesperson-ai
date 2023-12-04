'use client';

import { useContext } from 'react';
import useInterviewer from '@/hooks/use-interviewer';
import GlowButton from '../interact/glow-button';
import { useDisconnectButton } from '@livekit/components-react';
import axios from 'axios';
import { AnalyticsOutput, EndMeetingEvent } from '@/lib/dto';
import useMeetingID from '@/hooks/use-meeting-id';
import { AnalyticsContext } from '@/context/analytics-context';
import { isDefined } from '@/lib/typing';
import { useRouter } from 'next/navigation';

export default function MeetingControls() {
  const {
    buttonProps: { onClick: disconnect },
  } = useDisconnectButton({});
  const router = useRouter();

  const { meetingID } = useMeetingID();
  const { isInterviewer } = useInterviewer();

  const { analysisEvents } = useContext(AnalyticsContext);

  async function handleEndMeeting() {
    const transcripts = analysisEvents
      .map((event) => event.transcription?.text)
      .filter(isDefined);

    await axios<AnalyticsOutput>({
      url: `/api/analytics/${meetingID}`,
      method: 'POST',
      data: { transcripts } as EndMeetingEvent,
    });

    disconnect();
    router.replace(`/review/${meetingID}`);
  }

  return (
    <div className="mt-6 flex items-center justify-end">
      <GlowButton enabled={isInterviewer} onClick={handleEndMeeting}>
        End Meeting
      </GlowButton>
    </div>
  );
}
