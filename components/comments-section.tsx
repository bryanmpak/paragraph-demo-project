"use client";

import { useEffect, useMemo, useState } from "react";
import { usePerfSettings } from "./perf-settings";
import type {
  Badge,
  Comment,
  CommentsApiResponse,
  DevMetrics,
} from "@/lib/types";

const BADGE_CONFIG: Record<
  string,
  { emoji: string; label: string; color: string; badgeClass: string }
> = {
  supporter: { emoji: "🌱", label: "Supporter", color: "text-green-500", badgeClass: "border-neutral-700" },
  believer: { emoji: "⭐", label: "Believer", color: "text-yellow-400", badgeClass: "border-neutral-700" },
  patron: { emoji: "👑", label: "Patron", color: "text-amber-500", badgeClass: "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" },
};

const POST_DATE = new Date("2025-12-09");

const formatRelativeTime = (timestamp: string) => {
  const commentDate = new Date(timestamp);
  const diffMs = commentDate.getTime() - POST_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "0d";
  if (diffDays < 7) return `${diffDays}d`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo`;
};

const CommentsSection = ({ postId }: { postId: string }) => {
  const { commentLimit } = usePerfSettings();
  const [comments, setComments] = useState<Comment[]>([]);
  const [badges, setBadges] = useState<Record<string, Badge>>({});
  const [metrics, setMetrics] = useState<DevMetrics | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );

  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      setStatus("loading");
      try {
        const res = await fetch(
          `/api/posts/${postId}/comments?limit=${commentLimit}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load comments");
        const payload: CommentsApiResponse = await res.json();
        if (cancelled) return;
        setComments(payload.comments);
        setBadges(payload.badges ?? {});
        setMetrics(payload._devMetrics ?? null);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setStatus("error");
      }
    };

    fetchComments();
    return () => {
      cancelled = true;
    };
  }, [postId, commentLimit]);

  const badgeSummary = useMemo(() => {
    if (!metrics) return "";
    return `${metrics.badgesFound} badges · ${metrics.cacheHits} cache hits`;
  }, [metrics]);

  return (
    <div className="bg-[#1b1817] rounded-2xl p-6 flex flex-col gap-4 mt-4 mb-8">
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Comments</h2>
          <span className="text-sm text-muted-foreground">
            Showing {comments.length} / {commentLimit}
          </span>
        </div>
        {metrics ? (
          <p className="text-xs text-muted-foreground">{badgeSummary}</p>
        ) : null}
      </header>

      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading comments…</p>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive">
          Comments are unavailable right now.
        </p>
      )}

      {status === "ready" && comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.map((comment) => {
        const badge = badges[comment.user.id];
        const badgeConfig = badge?.tier ? BADGE_CONFIG[badge.tier] : null;
        return (
          <div key={comment.id} className="flex flex-col gap-1 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${badgeConfig?.color ?? ""}`}>
                {comment.user.displayName}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatRelativeTime(comment.createdAt)}
              </span>
              {badgeConfig ? (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeConfig.badgeClass}`}>
                  {badgeConfig.emoji} {badgeConfig.label}
                </span>
              ) : null}
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CommentsSection;
