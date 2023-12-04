'use client';

import { cn } from '@/lib/utils';
import useMeetingID from '@/hooks/use-meeting-id';
import useReportData from '@/hooks/use-report-data';

export default function MostDiscussedTopic({
  className,
}: {
  className?: string;
}) {
  const { meetingID } = useMeetingID();
  const { report } = useReportData(meetingID);

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Most Discussed Topic
        </h3>

        {report?.mostDiscussedTopic && <p className="font-bold text-sm uppercase">{report.mostDiscussedTopic.topic}</p>}
      </div>

      {report?.mostDiscussedTopic && (
        <p className="">{report.mostDiscussedTopic.description}</p>
      )}
    </div>
  );
}
