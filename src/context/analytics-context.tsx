'use client'

import { createContext, useState, type ReactNode } from 'react';

export const AnalyticsContext = createContext({
  analyticsOn: false,
  toggleAnalytics: (_: boolean) => {},
});

interface AnalyticsProviderProps {
  children?: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  const [analyticsOn, toggleAnalytics] = useState(false);

  return (
    <AnalyticsContext.Provider value={{ analyticsOn, toggleAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
