'use client';

import useInterviewer from '@/hooks/use-interviewer';
import useMeetingID from '@/hooks/use-meeting-id';
import { useRemoteParticipant } from '@livekit/components-react';
import axios from 'axios';
import { useEffect, useRef } from 'react';

export default function GuestJoinsEvent() {
  const { isInterviewer } = useInterviewer();

  const { meetingID } = useMeetingID();
  const remoteParticipant = useRemoteParticipant('guest');

  const hasSentAnalyticsEvent = useRef(false);

  // Send event when guest joins meeting
  useEffect(() => {
    if (
      !hasSentAnalyticsEvent.current &&
      meetingID &&
      meetingID !== 'new' &&
      remoteParticipant &&
      !isInterviewer
    ) {
      hasSentAnalyticsEvent.current = true;

      axios({
        url: `/api/analytics/joined/${meetingID}`,
        method: 'POST',
      });
    }
  }, [meetingID, remoteParticipant, isInterviewer]);

  return <></>;
}
