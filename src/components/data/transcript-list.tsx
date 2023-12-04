'use client';

import useMeetingID from '@/hooks/use-meeting-id';
import useReviewData from '@/hooks/use-review-data';
import { secondsToMMSS } from '@/lib/utils';

export default function TranscriptList() {
  const { meetingID } = useMeetingID();
  const { events } = useReviewData(meetingID);

  const transcripts = events
    ?.map((event) => ({
      time: event?.timestamp ?? 0,
      transcript: event?.transcription?.text ?? '',
    }))
    .sort((a, b) => a.time - b.time);

  if (!transcripts) return null;

  return (
    <div>
      <div className="grid grid-cols-[4rem_auto] grid-flow-row gap-y-4">
        {transcripts.map(({ time }, index) => (
          <p
            key={time}
            className="col-start-1 col-end-2 font-semibold text-center"
            style={{
              gridRowStart: index + 1,
              gridRowEnd: index + 2,
            }}
          >
            {secondsToMMSS(time)}
          </p>
        ))}

        {transcripts.map(({ transcript }, index) => (
          <p
            key={transcript}
            className="col-start-2 col-end-3 text-lg"
            style={{
              gridRowStart: index + 1,
              gridRowEnd: index + 2,
            }}
          >
            {transcript}
          </p>
        ))}
      </div>

      <p className="text-center my-4 uppercase font-semibold">Interview End</p>
    </div>
  );
}
