'use client';

import { useContext } from 'react';
import MagicSwitch from '../interact/magic-switch';
import { AnalyticsContext } from '@/context/analytics-context';
import useInterviewer from '@/hooks/use-interviewer';

export default function AnalyticsToggle() {
  const { analyticsOn, toggleAnalytics } = useContext(AnalyticsContext);
  const { isInterviewer } = useInterviewer();

  if (!isInterviewer) return null;

  return (
    <>
      <label htmlFor="" className="font-semibold text-foreground">
        Analytics {analyticsOn ? 'On' : 'Off'}
      </label>
      <MagicSwitch toggled={analyticsOn} onToggle={toggleAnalytics} />
    </>
  );
}
