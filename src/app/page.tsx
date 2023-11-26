import { Metadata } from 'next';
import MagicCard from '@/components/interact/magic-card';
import { BriefcaseIcon } from 'lucide-react';
import JoinMeeting from '@/components/configure/join-meeting';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Spokesperson AI | Join',
};

export default function HomePage() {
  return (
    <main className="max-w-xl sm:mx-auto mx-4 mt-32">
      <h2 className="text-center font-bold text-xl">Who are you?</h2>
      <div className="flex mx-auto w-fit mt-8">
        <MagicCard href="/meeting/new" className="h-[21rem]">
          <MagicCard.Icon>
            <BriefcaseIcon className="stroke-[1.2] p-1" />
          </MagicCard.Icon>
          <MagicCard.Title>Interviewer</MagicCard.Title>
          <MagicCard.Description>
            Create a new meeting. View engagement analytics. Receive messages in your Slack.
          </MagicCard.Description>
        </MagicCard>
        <Separator className="w-[1px] h-[21rem] mx-6 bg-muted" />
        <JoinMeeting />
      </div>
    </main>
  );
}
