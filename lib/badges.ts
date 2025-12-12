import { BADGE_CACHE_PREFIX } from "./constants";
import { prisma } from "./prisma";
import { computeTtlSeconds, redisGet, redisSet } from "./redis";

export type CachedBadge = {
  tier: string | null;
  balance: string;
  updatedAt: string;
};

type CachedBadgeEntry = CachedBadge | { none: true };

export type BadgeLookupResult = {
  badges: Record<string, CachedBadge>;
  cacheHits: number;
  cacheMisses: number;
  dbQueries: number;
};

const getCacheKey = (writerCoinId: string, userId: string) =>
  `${BADGE_CACHE_PREFIX}:${writerCoinId}:${userId}`;

export const resolveBadgesForUsers = async (
  writerCoinId: string,
  userIds: string[]
): Promise<BadgeLookupResult> => {
  const uniqueUserIds = Array.from(new Set(userIds));
  const badges: Record<string, CachedBadge> = {};

  let cacheHits = 0;
  let cacheMisses = 0;
  let dbQueries = 0;

  const cacheResults = await Promise.all(
    uniqueUserIds.map((userId) =>
      redisGet<CachedBadgeEntry>(getCacheKey(writerCoinId, userId))
    )
  );

  const missedUserIds: string[] = [];
  cacheResults.forEach((cached, i) => {
    const userId = uniqueUserIds[i];
    if (cached) {
      cacheHits += 1;
      if ("none" in cached) {
        return;
      }
      badges[userId] = cached;
    } else {
      cacheMisses += 1;
      missedUserIds.push(userId);
    }
  });

  if (missedUserIds.length > 0) {
    dbQueries = 1;
    const holdings = await prisma.writerCoinHolding.findMany({
      where: {
        writerCoinId,
        userId: { in: missedUserIds },
      },
      select: {
        userId: true,
        balance: true,
        tier: true,
        updatedAt: true,
      },
    });

    const holdingMap = new Map(
      holdings.map((holding) => [holding.userId, holding])
    );

    await Promise.all(
      missedUserIds.map(async (userId) => {
        const holding = holdingMap.get(userId);
        if (!holding) {
          await redisSet(
            getCacheKey(writerCoinId, userId),
            { none: true },
            computeTtlSeconds()
          );
          return;
        }

        const payload: CachedBadge = {
          tier: holding.tier,
          balance: holding.balance.toString(),
          updatedAt: holding.updatedAt.toISOString(),
        };

        badges[userId] = payload;
        await redisSet(
          getCacheKey(writerCoinId, userId),
          payload,
          computeTtlSeconds()
        );
      })
    );
  }

  return { badges, cacheHits, cacheMisses, dbQueries };
};
