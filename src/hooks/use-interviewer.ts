import { useParams } from 'next/navigation';

export default function useInterviewer() {
  const params = useParams();
  const meetingID = params.id;

  const isInterviewer = meetingID === 'new';
  return { isInterviewer };
}
