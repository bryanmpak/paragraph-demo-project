import { BADGE_CACHE_PREFIX } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

type ScanResult = [string, string[]];

export async function POST() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DEV_ENDPOINTS !== "true"
  ) {
    return NextResponse.json(
      { error: "not allowed in production" },
      { status: 403 }
    );
  }

  if (!redis) {
    return NextResponse.json(
      { error: "redis not configured" },
      { status: 400 }
    );
  }

  let cursor = "0";
  let deleted = 0;
  const pattern = `${BADGE_CACHE_PREFIX}:*`;

  try {
    do {
      const [nextCursor, keys] = (await redis.scan(cursor, {
        match: pattern,
        count: 200,
      })) as ScanResult;

      if (keys.length > 0) {
        await redis.del(...keys);
        deleted += keys.length;
      }

      cursor = nextCursor;
    } while (cursor !== "0");

    return NextResponse.json({ deleted });
  } catch (error) {
    console.error("failed to flush cache", error);
    return NextResponse.json(
      { error: "failed to flush cache" },
      { status: 500 }
    );
  }
}
