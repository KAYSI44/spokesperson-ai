'use client';

import { useState } from 'react';
import MagicCard from '../interact/magic-card';
import { Input } from '@/components/ui/input';
import { BriefcaseIcon } from 'lucide-react';

export default function JoinMeeting() {
  const [meetingID, setMeetingID] = useState('');

  return (
    <>
      <Input
        placeholder="Meeting ID"
        value={meetingID}
        onChange={(e) => setMeetingID(e.target.value)}
        className="col-start-3 col-end-4 row-start-1 row-end-2"
      />
      <MagicCard href={`/meeting/${meetingID}`} className="col-start-3 col-end-4 row-start-2 row-end-3">
        <MagicCard.Icon>
          <BriefcaseIcon className="stroke-[1.2] p-1" />
        </MagicCard.Icon>
        <MagicCard.Title>Interviewee</MagicCard.Title>
        <MagicCard.Description>
          You are being interviewed. Join with a meeting code.
        </MagicCard.Description>
      </MagicCard>
    </>
  );
}
