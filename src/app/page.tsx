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
    <main className="max-w-xl sm:mx-auto mx-4 mt-32 p-8 border-[1px] border-primary-foreground/50 rounded-xl w-fit h-fit">
      <h2 className="text-center font-bold text-xl">Who are you?</h2>
      <div className="mt-8 grid grid-cols[auto_5px_auto] grid-rows-[2.5rem_auto] h-72 gap-y-1">
        <MagicCard href="/meeting/new" className="col-start-1 col-end-2 row-start-1 row-end-3">
          <MagicCard.Icon>
            <BriefcaseIcon className="stroke-[1.2] p-1" />
          </MagicCard.Icon>
          <MagicCard.Title>Interviewer</MagicCard.Title>
          <MagicCard.Description>
            Create a new meeting. View engagement analytics. Receive messages in your Slack.
          </MagicCard.Description>
        </MagicCard>
        <Separator className="col-start-2 col-end-3 w-[2px] h-full mx-4 bg-muted row-start-1 row-end-3" />
        <JoinMeeting />
      </div>
    </main>
  );
}
