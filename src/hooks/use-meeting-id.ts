import { useParams } from 'next/navigation';

export default function useMeetingID() {
  const { id } = useParams();

  return { meetingID: id };
}
