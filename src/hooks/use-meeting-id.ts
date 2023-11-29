import { useParams } from 'next/navigation';

export default function useMeetingID() {
  const { id } = useParams();

  return { meetingID: Array.isArray(id) ? id[0] : id };
}
