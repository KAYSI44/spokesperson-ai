'use client';

import { type ReactNode } from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

interface ILoadingProviderProps {
  children?: ReactNode;
}

export default function LoadingProvider({ children }: ILoadingProviderProps) {
  return (
    <>
      {children}
      <Next13ProgressBar
        height="4px"
        color="#0A2FFF"
        options={{ showSpinner: true }}
        showOnShallow
      />
    </>
  );
}
