import GuestJoinsEvent from '@/components/analytics/guest-joins-event';
import AnalyticsToggle from '@/components/configure/analytics-toggle';
import MeetingControls from '@/components/configure/meeting-controls';
import AnalysisEvents from '@/components/events/analysis-events';
import CamPlayer from '@/components/stream/cam-player';
import RoomContext from '@/components/stream/room-context';
import StreamPlayer from '@/components/stream/stream-player';
import AnalyticsProvider from '@/context/analytics-context';

export default function MeetingPage() {
  return (
    <AnalyticsProvider>
      <RoomContext>
        <main className="overflow-hidden max-w-7xl mx-2 pt-2 mb-8 lg:mx-auto grid grid-cols-[auto_42ch] grid-rows-1 gap-2">
          <AnalysisEvents className="col-start-2 col-end-3 row-start-1 row-end-2 bg-muted/10 px-2 rounded-lg" />
          <div className="col-start-1 col-end-2 row-start-1 row-end-2">
            <div className="my-6 flex items-center justify-end gap-4 px-2">
              {/* <MagicButton dotsAmount={10}>Start Interview</MagicButton> */}
              <AnalyticsToggle />
            </div>
            <div className="grid grid-cols-2 grid-rows-1 gap-2 min-h-[80vh]">
              <StreamPlayer
                isInterviewerScreen
                analyticsIntervalMs={4500}
                className="col-start-1 col-end-2 row-span-1"
                videoId="DWUBmZEhSfKbfbNJe00EGja22bkM1kt00zcHGYjcRzIHQ"
                playbackId="fY9Kvk9oNthmsnYXbkICJzYaMfRvlE0001HhTyu4mYGdY"
              />
              <CamPlayer
                className="col-start-2 col-end-3 row-span-1"
                videoId="MSN4xmQ401xkgUBLODFcX1JyvK027YtleU3ar600o2TcMk"
                playbackId="m4RtglXP6uJCcXxMhBTTu8Is3LInbSK4UAILWhdsaVQ"
              />
            </div>
            <MeetingControls />
            <GuestJoinsEvent />
          </div>
        </main>
      </RoomContext>
    </AnalyticsProvider>
  );
}
