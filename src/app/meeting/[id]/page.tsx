import AnalyticsToggle from '@/components/configure/analytics-toggle';
import AnalysisEvents from '@/components/events/analysis-events';
import CamPlayer from '@/components/stream/cam-player';
import RoomContext from '@/components/stream/room-context';
import StreamPlayer from '@/components/stream/stream-player';

export default function MeetingPage() {
  return (
    <main>
      <RoomContext>
        <AnalysisEvents />
        <div className="mb-8 mt-8 flex items-center justify-center gap-4">
          {/* <MagicButton dotsAmount={10}>Start Interview</MagicButton> */}
          <AnalyticsToggle />
        </div>
        <div className="max-w-4xl lg:mx-auto mx-2 grid grid-cols-2 grid-rows-1 gap-2 min-h-[80vh]">
          <StreamPlayer
            isInterviewerScreen
            analyticsIntervalMs={5000}
            className="col-start-1 col-end-2 row-span-1"
            videoId="QoBSJukQL8sTOj7ajvvvYlNF1spSbjMFtXt9AFI1Lo00"
            playbackId="7Xoqe3ndrAqgNXEx1f39RQ7Jzv02gkoRwW5K2nHlzP01U"
          />
          <CamPlayer
            className="col-start-2 col-end-3 row-span-1"
            videoId="QoBSJukQL8sTOj7ajvvvYlNF1spSbjMFtXt9AFI1Lo00"
            playbackId="7Xoqe3ndrAqgNXEx1f39RQ7Jzv02gkoRwW5K2nHlzP01U"
          />
          {/* <StreamPlayer
          analyticsIntervalMs={5000}
          className="col-start-2 col-end-3 row-span-1"
          videoId="QoBSJukQL8sTOj7ajvvvYlNF1spSbjMFtXt9AFI1Lo00"
          playbackId="7Xoqe3ndrAqgNXEx1f39RQ7Jzv02gkoRwW5K2nHlzP01U"
        /> */}
        </div>
      </RoomContext>
    </main>
  );
}
