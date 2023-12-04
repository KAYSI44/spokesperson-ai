'use client';

import { cn } from '@/lib/utils';
import useMeetingID from '@/hooks/use-meeting-id';
import useReportData from '@/hooks/use-report-data';

export default function TotalQuestionsAsked({
  className,
}: {
  className?: string;
}) {
  const { meetingID } = useMeetingID();
  const { report } = useReportData(meetingID);

  const totalQuestionsAsked = report?.questionsAsked.length;

  return (
    <div
      className={cn('p-6 rounded-lg bg-muted/50 overflow-hidden', className)}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Total Questions Asked
        </h3>
      </div>

      {totalQuestionsAsked !== undefined ? <p className="text-4xl font-bold text-center my-4">{totalQuestionsAsked}</p> : <div>NIL</div>}
    </div>
  );
}
