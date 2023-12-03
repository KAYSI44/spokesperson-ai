import AwarenessChart from '@/components/charts/awareness-chart';
import SmileChart from '@/components/charts/smile-chart';
import CurrentFrame from '@/components/data/current-frame';
import CurrentTranscript from '@/components/data/current-transcript';
import FeedbackReactions from '@/components/data/feedback-reactions';
import TimestampSlider from '@/components/interact/timestamp-slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewProvider from '@/context/review-context';

export default function ReviewPage() {
  return (
    <ReviewProvider>
      <Tabs
        defaultValue="overall"
        className="xl:mx-auto mx-4 max-w-4xl flex items-center justify-center gap-4 flex-col xl:pt-24 pt-14 pb-8"
      >
        <TabsList className="absolute top-0 left-0 m-4 xl:m-8">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="overall">
          <div className="space-y-2">
            <AwarenessChart />
            <SmileChart />
          </div>
        </TabsContent>
        <TabsContent value="detailed">
          <CurrentFrame className="w-full h-auto aspect-video" />
          <TimestampSlider className="w-full mb-12 mt-4" />
          <div className="grid grid-cols-[3fr_1fr] grid-rows-1 gap-2">
            <CurrentTranscript className="col-start-1 col-end-2 row-start-1 row-end-2" />
            <FeedbackReactions className="col-start-2 col-end-3 row-start-1 row-end-2" />
          </div>
        </TabsContent>
      </Tabs>
    </ReviewProvider>
  );
}
