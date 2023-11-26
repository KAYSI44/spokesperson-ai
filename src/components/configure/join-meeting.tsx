'use client';

import { useState } from 'react';
import MagicCard from '../interact/magic-card';
import { Input } from '@/components/ui/input';
import { BriefcaseIcon } from 'lucide-react';

export default function JoinMeeting() {
  const [meetingID, setMeetingID] = useState('');

  return (
    <div className="flex flex-col gap-2 items-stretch">
      <Input
        placeholder="Meeting ID"
        value={meetingID}
        onChange={(e) => setMeetingID(e.target.value)}
      />
      <MagicCard href={`/meeting/${meetingID}`}>
        <MagicCard.Icon>
          <BriefcaseIcon className="stroke-[1.2] p-1" />
        </MagicCard.Icon>
        <MagicCard.Title>Interviewee</MagicCard.Title>
        <MagicCard.Description>
          You are being interviewed. Join with a meeting code.
        </MagicCard.Description>
      </MagicCard>
    </div>
  );
}
