import AnalyticsToggle from '@/components/configure/analytics-toggle';
import MagicButton from '@/components/interact/magic-button';
import StreamPlayer from '@/components/stream/stream-player';

export default function Home() {
  return (
    <main>
      <div className="mb-2 mt-8 flex items-center justify-center gap-4">
        {/* <MagicButton dotsAmount={10}>Start Interview</MagicButton> */}
        <AnalyticsToggle />
      </div>
      <div className="max-w-4xl lg:mx-auto mx-2 grid grid-cols-2 grid-rows-1 gap-2 min-h-[80vh]">
        <StreamPlayer className="col-start-1 col-end-2 row-span-1" />
        {/* <StreamPlayer className="col-start-2 col-end-3 row-span-1" /> */}
      </div>
    </main>
  );
}
