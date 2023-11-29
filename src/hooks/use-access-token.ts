import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import useMeetingID from './use-meeting-id';
import { AccessTokenOutput } from '@/lib/dto';
import { generateRandomID } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { NEW_MEETING } from '@/lib/constants';

export default function useAccessToken() {
  const router = useRouter();
  const hasReplacedRouteRef = useRef(false);
  const { meetingID } = useMeetingID();

  const [accessToken, setAccessToken] = useSessionStorage('access-token', '');
  const [oldMeetingID, setOldMeetingID] = useSessionStorage('meeting-id', '');

  async function generateToken(asGuest?: boolean) {
    // If host, generate a meeting ID
    let f_meetingID = meetingID;
    if (!asGuest) {
      f_meetingID = generateRandomID();
    }

    const { data, status } = await axios<AccessTokenOutput>({
      url: `/api/meeting/${f_meetingID}`,
      method: 'POST',
      data: {
        asGuest: !!asGuest,
      },
    });

    if (status !== 200 || data.error) {
      throw new Error(data.error?.message ?? 'An error has occured');
    }

    return { token: data.result?.token as string, f_meetingID };
  }

  useEffect(() => {
    (async () => {
      if (
        !hasReplacedRouteRef.current &&
        (accessToken.length === 0 ||
          meetingID === NEW_MEETING ||
          meetingID !== oldMeetingID)
      ) {
        const { token, f_meetingID } = await generateToken(
          meetingID !== NEW_MEETING,
        );
        setAccessToken(token);
        setOldMeetingID(f_meetingID);

        // If host, redirect to new meeting
        router.replace(`/meeting/${f_meetingID}`);
        hasReplacedRouteRef.current = true;
      }
    })();
  }, [accessToken, meetingID, oldMeetingID]);

  return { accessToken };
}
