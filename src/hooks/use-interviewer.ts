import { IDENTITY } from '@/lib/constants';
import { useLocalParticipant } from '@livekit/components-react';

export default function useInterviewer(analyticsEnabled: boolean = true) {
  const { localParticipant } = useLocalParticipant();
  const isInterviewer = localParticipant.identity === IDENTITY.HOST;

  return { isInterviewer };
}
