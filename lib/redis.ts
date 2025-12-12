import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

if (!redis) {
  console.warn(
    "[redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing; caching disabled."
  );
}

export const redisGet = async <T>(key: string): Promise<T | null> => {
  if (!redis) return null;
  try {
    const value = await redis.get<unknown>(key);
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === "string") {
      try {
        return JSON.parse(value) as T;
      } catch (parseErr) {
        console.error(`[redis] Failed to parse value for ${key}`, parseErr);
        return null;
      }
    }
    if (typeof value === "object") {
      return value as T;
    }
    return null;
  } catch (err) {
    console.error(`[redis] GET ${key} failed`, err);
    return null;
  }
};

export const redisSet = async (
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> => {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (err) {
    console.error(`[redis] SET ${key} failed`, err);
  }
};

export const redisDel = async (key: string): Promise<void> => {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`[redis] DEL ${key} failed`, err);
  }
};

export const computeTtlSeconds = (base = 600, staggerSeconds = 120) =>
  base + Math.floor(Math.random() * staggerSeconds);
