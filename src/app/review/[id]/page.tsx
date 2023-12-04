import AwarenessChart from '@/components/charts/awareness-chart';
import ConversationTime from '@/components/charts/conversation-time';
import OverallKeyPhrases from '@/components/charts/overall-key-phrases';
import QualityChart from '@/components/charts/quality-chart';
import SmileChart from '@/components/charts/smile-chart';
import ToxicityChart from '@/components/charts/toxicity-chart';
import WordFrequency from '@/components/charts/word-frequency';
import CurrentEventJSON from '@/components/data/current-event-json';
import CurrentFrame from '@/components/data/current-frame';
import CurrentTranscript from '@/components/data/current-transcript';
import FeedbackReactions from '@/components/data/feedback-reactions';
import MostDiscussedTopic from '@/components/data/most-discussed-topic';
import OverallPii from '@/components/data/overall-pii';
import OverallSentiment from '@/components/data/overall-sentiment';
import PiiList from '@/components/data/pii-list';
import QuestionsAsked from '@/components/data/questions-asked';
import SuggestionsList from '@/components/data/suggestions-list';
import TopicsDiscussed from '@/components/data/topics-discussed';
import TotalQuestionsAsked from '@/components/data/total-questions-asked';
import ToxicityIndicator from '@/components/data/toxicity-indicator';
import TranscriptList from '@/components/data/transcript-list';
import WPMStats from '@/components/data/words-per-minutes';
import TimestampSlider from '@/components/interact/timestamp-slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewProvider from '@/context/review-context';

export default function ReviewPage() {
  return (
    <ReviewProvider>
      <Tabs
        defaultValue="engagement"
        className="xl:mx-auto mx-4 max-w-4xl flex items-start justify-start gap-4 flex-col xl:mt-24 mt-8 pb-8"
      >
        <TabsList className="my-1">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="report">AI Report</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="overall">
          <div className="space-y-2">
            <AwarenessChart />
            <ToxicityChart />
            <QualityChart />
            <SmileChart />
            <OverallPii />
            <OverallKeyPhrases />
          </div>
        </TabsContent>
        <TabsContent value="detailed" className="grow-0 shrink-0 w-full">
          <CurrentFrame className="w-full h-auto aspect-video" />
          <TimestampSlider className="w-full mb-12 mt-4" />
          <div className="grid grid-cols-[3fr_1fr] grid-rows-1 gap-2">
            <CurrentTranscript className="col-start-1 col-end-2 row-start-1 row-end-2" />
            <FeedbackReactions className="col-start-2 col-end-3 row-start-1 row-end-2" />
          </div>
          <ToxicityIndicator className="mt-2" />
          <PiiList className="mt-2" />
          <CurrentEventJSON className="mt-2" />
        </TabsContent>
        <TabsContent value="report" className="grow-0 shrink-0 w-full">
          <SuggestionsList />
          <MostDiscussedTopic className="mt-2" />
          <OverallSentiment className="mt-2" />
          <TopicsDiscussed className="mt-2" />
          <QuestionsAsked className="mt-2" />
        </TabsContent>
        <TabsContent value="transcript" className="grow-0 shrink-0 w-full">
          <TranscriptList />
        </TabsContent>
        <TabsContent value="engagement" className="grow-0 shrink-0 w-full">
          <WPMStats />
          <WordFrequency className="mt-2" />
          <TotalQuestionsAsked className="mt-2" />
          <ConversationTime className="mt-2" />
        </TabsContent>
      </Tabs>
    </ReviewProvider>
  );
}
