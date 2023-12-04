'use client';

import { CaretRightIcon } from '@radix-ui/react-icons';
import { unix } from 'moment';
import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';

export default function PastMeetings() {
  const [pastMeetings, setPastMeetings] = useLocalStorage<
    {
      meetingID: string;
      lastUsedUnixMS: number;
    }[]
  >('pastMeetings', []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Past Meetings</h2>

      {!pastMeetings.length && (
        <p className="uppercase text-center my-2">No meetings yet.</p>
      )}

      {pastMeetings.map((meeting) => (
        <Link
          key={meeting.meetingID}
          href={`/review/${meeting.meetingID}`}
          className="p-4 my-2 bg-muted/20 rounded-sm flex items-center justify-between group"
        >
          <div>
            <p className="font-mono font-semibold">{meeting.meetingID}</p>
            <p className="mt-1">
              {unix(meeting.lastUsedUnixMS / 1000).format(
                'dddd, MMMM Do YYYY [at] h:mm A',
              )}
            </p>
          </div>
          <CaretRightIcon className="w-8 h-8 transform transition-transform -translate-x-4 group-hover:translate-x-0" />
        </Link>
      ))}
    </div>
  );
}
