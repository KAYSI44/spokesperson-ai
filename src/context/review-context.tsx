'use client';

import { createContext, useState, type ReactNode } from 'react';

export const ReviewContext = createContext({
  currentTimestamp: 0,
  setCurrentTimestamp: (_: number) => {},
});

interface ReviewProviderProps {
  children?: ReactNode;
}

export default function ReviewProvider({ children }: ReviewProviderProps) {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  return (
    <ReviewContext.Provider value={{ currentTimestamp, setCurrentTimestamp }}>
      {children}
    </ReviewContext.Provider>
  );
}
