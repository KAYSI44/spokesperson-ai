import CurrentFrame from '@/components/data/current-frame';
import FeedbackReactions from '@/components/data/feedback-reactions';
import TimestampSlider from '@/components/interact/timestamp-slider';
import ReviewProvider from '@/context/review-context';

export default function ReviewPage() {
  return (
    <ReviewProvider>
      <div className="mx-auto grid place-items-center h-full">
        <FeedbackReactions />
        <CurrentFrame />
        <TimestampSlider />
      </div>
    </ReviewProvider>
  );
}
