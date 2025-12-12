"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePerfSettings } from "./perf-settings";
import type { DevMetrics } from "@/lib/types";

const limitPresets = [100, 500];

const fetchCommentsMetrics = async (postId: string, limit: number) => {
  const response = await fetch(`/api/posts/${postId}/comments?limit=${limit}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  const payload = await response.json();
  return payload._devMetrics as DevMetrics | undefined;
};

const PerfDemoPanel = ({ postId }: { postId: string }) => {
  const { commentLimit, setCommentLimit } = usePerfSettings();
  const [status, setStatus] = useState<"idle" | "running">("idle");
  const [flushing, setFlushing] = useState(false);
  const [result, setResult] = useState<{
    scenario: string;
    metrics: DevMetrics | null;
    totalMs: number;
  } | null>(null);
  const scheduleReset = () => {
    setTimeout(() => setResult(null), 7500);
  };

  const runScenario = async (label: string, requestCount: number) => {
    setStatus("running");
    const start = performance.now();
    try {
      const metricsResponses = await Promise.all(
        Array.from({ length: requestCount }, () =>
          fetchCommentsMetrics(postId, commentLimit)
        )
      );
      const lastMetrics = metricsResponses[metricsResponses.length - 1] ?? null;
      setResult({
        scenario: label,
        metrics: lastMetrics,
        totalMs: performance.now() - start,
      });
      scheduleReset();
    } finally {
      setStatus("idle");
    }
  };

  const flushCache = async () => {
    setFlushing(true);
    try {
      await fetch("/api/dev/flush-badge-cache", { method: "POST" });
      setResult({ scenario: "cache flushed", metrics: null, totalMs: 0 });
      scheduleReset();
    } finally {
      setFlushing(false);
    }
  };

  return (
    <div className="bg-[#1b1817] rounded-2xl p-3 flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">perf panel</h3>
          <p className="text-xs text-muted-foreground">
            simulate cold / warm badge lookups
          </p>
        </div>
        <Button
          variant={"outline"}
          className="text-xs"
          onClick={flushCache}
          disabled={flushing || status === "running"}
        >
          {flushing ? "flushing…" : "cold cache"}
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">comment limit:</span>
        {limitPresets.map((preset) => (
          <Button
            key={preset}
            className={`text-sm px-3 py-1 rounded-full border transition ${
              commentLimit === preset
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
            onClick={() => setCommentLimit(preset)}
            disabled={status === "running"}
          >
            {preset}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={"outline"}
          className="text-sm"
          disabled={status === "running"}
          onClick={() => runScenario("Single request", 1)}
        >
          single request
        </Button>
        <Button
          variant={"outline"}
          className="text-sm"
          disabled={status === "running"}
          onClick={() => runScenario("Burst x5", 5)}
        >
          burst x5
        </Button>
      </div>

      {status === "running" && (
        <p className="text-sm text-muted-foreground">running scenario…</p>
      )}

      {result && (
        <div className="text-sm bg-muted rounded-xl p-3 flex flex-col gap-1">
          <span className="font-medium">{result.scenario}</span>
          {result.totalMs > 0 && (
            <span>total time: {result.totalMs.toFixed(1)}ms</span>
          )}
          {result.metrics && (
            <span className="text-muted-foreground">
              cache hits: {result.metrics.cacheHits} · misses:{" "}
              {result.metrics.cacheMisses} · db queries:{" "}
              {result.metrics.dbQueries} · api elapsed:{" "}
              {result.metrics.elapsedMs}ms
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfDemoPanel;
