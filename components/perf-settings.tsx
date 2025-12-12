"use client";

import { createContext, useContext, useState } from "react";

type PerfSettingsContextValue = {
  commentLimit: number;
  setCommentLimit: (value: number) => void;
};

const PerfSettingsContext = createContext<PerfSettingsContextValue | null>(
  null
);

export const PerfSettingsProvider = ({
  initialLimit = 100,
  children,
}: {
  initialLimit?: number;
  children: React.ReactNode;
}) => {
  const [commentLimit, setCommentLimit] = useState(initialLimit);

  return (
    <PerfSettingsContext.Provider value={{ commentLimit, setCommentLimit }}>
      {children}
    </PerfSettingsContext.Provider>
  );
};

export const usePerfSettings = () => {
  const value = useContext(PerfSettingsContext);
  if (!value) {
    throw new Error("usePerfSettings must be used within PerfSettingsProvider");
  }
  return value;
};
