'use client';

import { GhostIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isMock: boolean;
  toggleMock: (_: boolean) => void;
}

export default function ControlPanel({
  isMock,
  toggleMock,
}: ControlPanelProps) {
  return (
    <div className="w-full bg-muted/40 p-1 rounded-sm flex items-center">
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
    </div>
  );
}
