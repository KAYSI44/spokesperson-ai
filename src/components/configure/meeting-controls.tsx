'use client';

import useInterviewer from '@/hooks/use-interviewer';
import GlowButton from '../interact/glow-button';
import { useDisconnectButton } from '@livekit/components-react';

export default function MeetingControls() {
  const { buttonProps } = useDisconnectButton({});
  const { isInterviewer } = useInterviewer();

  return (
    <div className="mt-6 flex items-center justify-end">
      <GlowButton enabled={isInterviewer} onClick={buttonProps.onClick}>
        End Meeting
      </GlowButton>
    </div>
  );
}
