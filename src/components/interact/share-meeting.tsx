'use client';

import useInterviewer from '@/hooks/use-interviewer';
import useMeetingID from '@/hooks/use-meeting-id';
import { ClipboardCopyIcon } from 'lucide-react';

export default function ShareMeeting() {
  const { meetingID } = useMeetingID();
  const { isInterviewer } = useInterviewer();

  if (!isInterviewer) return null;

  return (
    <div className="group p-4 bg-muted/50 rounded-sm flex items-center justify-between w-[28rem]">
      <p className="font-mono font-semibold group-hover:underline">
        SHARE LINK: /meeting/{meetingID}
      </p>
      <ClipboardCopyIcon className="w-4 h-4" />
    </div>
  );
}
