import { OverallReportOutput } from '@/lib/dto';
import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Sometimes, report data is not available immediately after transitioning from /meeting to /review
// This hook keeps revalidating data at an interval until the data becomes available
export default function useReportData(
  meetingID: string,
  options?: SWRConfiguration<OverallReportOutput>,
) {
  const { data, error, mutate } = useSWR<OverallReportOutput>(
    `/api/overall/${meetingID}`,
    fetcher,
    options,
  );

  const [isFetching, toggleFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isFetching) {
        toggleFetching(true);

        try {
          // Attempt to refetch the data
          await mutate();
        } catch (error) {
        } finally {
          toggleFetching(false);
        }
      }
    };

    // If there is an error, keep refetching until it succeeds
    if (error) {
      const retryInterval = setInterval(fetchData, 2000);
      return () => clearInterval(retryInterval);
    }
  }, [error, isFetching, mutate]);

  return {
    report: data?.result,
    isLoading: !data && !error,
    isError: !!error,
  };
}
