"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { DevMetrics } from "@/lib/types";

type PerfSettingsContextValue = {
  commentLimit: number;
  setCommentLimit: (value: number) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  latestMetrics: DevMetrics | null;
  setLatestMetrics: (metrics: DevMetrics | null) => void;
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [latestMetrics, setLatestMetrics] = useState<DevMetrics | null>(null);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <PerfSettingsContext.Provider
      value={{
        commentLimit,
        setCommentLimit,
        refreshKey,
        triggerRefresh,
        latestMetrics,
        setLatestMetrics,
      }}
    >
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
