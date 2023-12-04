'use client';

import { cn } from '@/lib/utils';
import useMeetingID from '@/hooks/use-meeting-id';
import useReportData from '@/hooks/use-report-data';
import Sentiment from './sentiment';

export default function TopicsDiscussed({ className }: { className?: string }) {
  const { meetingID } = useMeetingID();
  const { report } = useReportData(meetingID);

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Topics Discussed
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {report?.topicsDiscussed &&
          report.topicsDiscussed.map((topic, index) => (
            <div
              key={topic.topic}
              className="p-4 bg-muted/80 my-2 w-fit rounded-sm"
            >
              <p className="font-semibold mb-2">{topic.topic}</p>
              <Sentiment sentiment={topic.sentiment} id={index.toString()} />
            </div>
          ))}
      </div>
    </div>
  );
}
