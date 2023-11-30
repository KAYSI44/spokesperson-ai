'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import ControlPanel from './control-panel';
import MuxVideo from '@mux/mux-video-react';
import {
  TrackReference,
  VideoTrack,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

interface CamPlayerProps {
  className?: string;
  playbackId: string;
  videoId: string;
}

export default function CamPlayer({
  className,
  playbackId: mockPlaybackId,
  videoId: mockVideoId,
}: CamPlayerProps) {
  const [isMock, toggleMock] = useState(true);

  const [playbackId, setPlaybackId] = useState<string>();
  const [videoId, setVideoId] = useState<string>();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const localTrack = tracks.find((track) => track.participant.isLocal);

  useEffect(() => {
    if (isMock) {
      setPlaybackId(mockPlaybackId);
      setVideoId(mockVideoId);
    } else {
      setPlaybackId(undefined);
      setVideoId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMock]);

  return (
    <div
      className={cn(
        className,
        'w-full h-full mx-auto p-1 border border-muted rounded-lg overflow-hidden',
      )}
    >
      <ControlPanel withInputControls isMock={isMock} toggleMock={toggleMock} />
      {isMock && (
        <MuxVideo
          className="w-full h-full object-cover"
          playbackId={playbackId}
          metadata={{
            video_id: videoId,
            video_title: 'Super Interesting Video',
            viewer_user_id: 'user-id-bc-789',
          }}
          streamType="on-demand"
          controls
          autoPlay={false}
          muted={false}
        />
      )}

      {!isMock && localTrack && (
        <VideoTrack className="w-full h-full object-cover" trackRef={localTrack as TrackReference} />
      )}
    </div>
  );
}
