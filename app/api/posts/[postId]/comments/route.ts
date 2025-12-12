import { resolveBadgesForUsers } from "@/lib/badges";
import { prisma } from "@/lib/prisma";
import type { Badge } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const startTime = performance.now();
  const { postId } = await params;
  const limitParam = request.nextUrl.searchParams.get("limit");
  const parsedLimit = parseInt(limitParam ?? "", 10);
  const limit = Number.isNaN(parsedLimit) ? 100 : Math.max(1, Math.min(parsedLimit, 500));

  // check post exists first
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      writer: {
        include: { coin: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const userIds = [...new Set(comments.map((c) => c.user.id))];

  // redis wiring & build devMetrics for perf panel
  const badges: Record<string, Badge> = {};
  let cacheHits = 0;
  let cacheMisses = 0;
  let dbQueries = 0;

  let badgeError: string | null = null;

  if (post.writer?.coin && userIds.length > 0) {
    try {
      const result = await resolveBadgesForUsers(post.writer.coin.id, userIds);
      for (const [userId, badge] of Object.entries(result.badges)) {
        badges[userId] = badge;
      }
      cacheHits = result.cacheHits;
      cacheMisses = result.cacheMisses;
      dbQueries = result.dbQueries;
    } catch (error) {
      console.error("Failed to resolve badges", error);
      badgeError = "badge_lookup_failed";
    }
  }

  const elapsedMs = performance.now() - startTime;

  return NextResponse.json({
    comments,
    badges,
    _devMetrics: {
      commentCount: comments.length,
      uniqueCommenters: userIds.length,
      badgesFound: Object.keys(badges).length,
      cacheHits,
      cacheMisses,
      dbQueries,
      elapsedMs: Math.round(elapsedMs * 100) / 100,
      badgeError,
    },
  });
}
