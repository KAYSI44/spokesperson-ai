'use client';

import { cn } from '@/lib/utils';
import useMeetingID from '@/hooks/use-meeting-id';
import useReportData from '@/hooks/use-report-data';

export default function SuggestionsList({ className }: { className?: string }) {
  const { meetingID } = useMeetingID();
  const { report } = useReportData(meetingID);

  return (
    <div
      className={cn(
        'p-6 rounded-lg bg-muted/50 overflow-hidden',
        className,
      )}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-muted-foreground/80">
          Suggestions
        </h3>
      </div>

      {report?.suggestions &&
        report.suggestions.map((suggestion) => (
          <p className="bg-muted/80 my-2 p-2 rounded-sm" key={suggestion}>{suggestion}</p>
        ))}
    </div>
  );
}
