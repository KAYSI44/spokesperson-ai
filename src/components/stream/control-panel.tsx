'use client';

import {
  GhostIcon,
  CameraIcon,
  CameraOffIcon,
  MicIcon,
  MicOffIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import { cn } from '@/lib/utils';
import { useTrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface ControlPanelProps {
  isMock: boolean;
  withInputControls?: boolean;
  toggleMock: (_: boolean) => void;
}

export default function ControlPanel({
  isMock,
  toggleMock,
  withInputControls,
}: ControlPanelProps) {
  const { enabled: camEnabled, toggle: toggleCam } = useTrackToggle({
    source: Track.Source.Camera,
  });

  const { enabled: micEnabled, toggle: toggleMic } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  return (
    <div className="w-full bg-muted/40 p-1 rounded-sm flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            variant="default"
            className={cn(isMock && 'bg-muted/80')}
            pressed={isMock}
            onPressedChange={(state) => toggleMock(state)}
          >
            <GhostIcon className="w-4 h-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mock Source</p>
        </TooltipContent>
      </Tooltip>
      {withInputControls && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="default"
                className={cn(camEnabled && 'bg-muted/80')}
                pressed={camEnabled}
                onPressedChange={(state) => toggleCam(state)}
              >
                {camEnabled ? (
                  <CameraIcon className="w-4 h-4" />
                ) : (
                  <CameraOffIcon className="w-4 h-4" />
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Camera</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="default"
                className={cn(micEnabled && 'bg-muted/80')}
                pressed={micEnabled}
                onPressedChange={(state) => toggleMic(state)}
              >
                {micEnabled ? (
                  <MicIcon className="w-4 h-4" />
                ) : (
                  <MicOffIcon className="w-4 h-4" />
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Microphone</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}
