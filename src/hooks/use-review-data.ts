import { ReviewOutput } from '@/lib/dto';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useReviewData(meetingID: string) {
  const { data, error } = useSWR<ReviewOutput>(
    `/api/review/${meetingID}`,
    fetcher,
  );

  return {
    events: data?.result?.events,
    isLoading: !data && !error,
    isError: !!error,
  };
}
