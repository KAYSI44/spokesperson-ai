'use client';

import { useContext } from 'react';
import MagicSwitch from '../interact/magic-switch';
import { AnalyticsContext } from '@/context/analytics-context';

export default function AnalyticsToggle() {
  const { analyticsOn, toggleAnalytics } = useContext(AnalyticsContext);

  return (
    <>
      <label htmlFor="" className="font-semibold text-foreground">
        Analytics {analyticsOn ? 'On' : 'Off'}
      </label>
      <MagicSwitch toggled={analyticsOn} onToggle={toggleAnalytics} />
    </>
  );
}
