import AwarenessChart from '@/components/charts/awareness-chart';
import CurrentFrame from '@/components/data/current-frame';
import CurrentTranscript from '@/components/data/current-transcript';
import FeedbackReactions from '@/components/data/feedback-reactions';
import TimestampSlider from '@/components/interact/timestamp-slider';
import ReviewProvider from '@/context/review-context';

export default function ReviewPage() {
  return (
    <ReviewProvider>
      <div className="xl:mx-auto mx-4 max-w-4xl flex items-center justify-center gap-4 flex-col h-full">
        {/* <CurrentFrame className="w-full h-auto aspect-video" /> */}
        <TimestampSlider className="w-full mb-8" />
        <div className="grid grid-cols-[3fr_1fr] grid-rows-1 gap-2">
          <CurrentTranscript className="col-start-1 col-end-2 row-start-1 row-end-2" />
          <FeedbackReactions className="col-start-2 col-end-3 row-start-1 row-end-2" />
        </div>
        <AwarenessChart />
      </div>
    </ReviewProvider>
  );
}
