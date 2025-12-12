import type { User } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_TARGET_COMMENTS = 2000;
const TARGET_POST_ID = process.env.SEED_POST_ID ?? "post_gen_what";
const requestedCount = Number(
  process.env.SEED_COMMENT_COUNT ?? DEFAULT_TARGET_COMMENTS
);
const TARGET_COMMENT_COUNT =
  Number.isFinite(requestedCount) && requestedCount > 0
    ? requestedCount
    : DEFAULT_TARGET_COMMENTS;
const MAX_COMMENT_COUNT = 4000;
const COMMENT_BODIES = [
  "gm ☀️",
  "gud post",
  "💙",
  "gen z gud",
  "gen x gud",
  "millennials ftw",
  "badge flex",
  "moar badges pls",
  "supporter since day 1",
  "believers assemble",
  "gm gm gm",
  "patron vibes",
  "ngmi without comments",
  "comment squad checking in",
  "this thread slaps",
  "writer coins go brr",
];

const FAKE_USER_ID_PREFIX = "fake_user_";

function normalizeCommentTarget(holderCount: number): number {
  const desired = Math.max(holderCount, TARGET_COMMENT_COUNT);
  const capped = Math.min(desired, MAX_COMMENT_COUNT);
  if (capped < desired) {
    console.warn(
      `Requested ${desired} comments but capping at ${MAX_COMMENT_COUNT}.`
    );
  }
  return capped;
}

async function fetchPostWithCoin() {
  const post = await prisma.post.findUnique({
    where: { id: TARGET_POST_ID },
    include: {
      writer: { include: { coin: true } },
    },
  });

  if (!post?.writer?.coin) {
    throw new Error(
      `Post ${TARGET_POST_ID} is missing an associated writer coin.`
    );
  }

  return post;
}

async function loadHolderUsers(
  writerCoinId: string
): Promise<Array<Pick<User, "id" | "displayName">>> {
  const holdings = await prisma.writerCoinHolding.findMany({
    where: { writerCoinId },
    include: {
      user: {
        select: { id: true, displayName: true },
      },
    },
    orderBy: { balance: "desc" },
  });

  return holdings.map((holding) => holding.user);
}

function buildFakeUserDefinition(index: number) {
  const hexSuffix = index.toString(16).padStart(4, "0");
  const id = `${FAKE_USER_ID_PREFIX}${index.toString().padStart(4, "0")}`;
  const displayName = `0xfake...${hexSuffix}`;
  const walletAddress = (`0xfake${hexSuffix}` + "0".repeat(42)).slice(0, 42);
  return { id, displayName, walletAddress };
}

async function ensureFakeUsers(
  count: number
): Promise<Array<Pick<User, "id" | "displayName">>> {
  if (count <= 0) {
    return [];
  }

  const existing = await prisma.user.findMany({
    where: { id: { startsWith: FAKE_USER_ID_PREFIX } },
    select: { id: true, displayName: true },
    orderBy: { id: "asc" },
    take: count,
  });

  const missing = count - existing.length;
  if (missing <= 0) {
    return existing.slice(0, count);
  }

  const startIndex = existing.length;
  const creationPromises = Array.from({ length: missing }, (_, offset) => {
    const definition = buildFakeUserDefinition(startIndex + offset + 1);
    return prisma.user.upsert({
      where: { id: definition.id },
      update: {
        displayName: definition.displayName,
        walletAddress: definition.walletAddress,
      },
      create: {
        id: definition.id,
        displayName: definition.displayName,
        walletAddress: definition.walletAddress,
      },
      select: { id: true, displayName: true },
    });
  });

  const created = await Promise.all(creationPromises);
  return [...existing, ...created];
}

function buildCommentBody(index: number): string {
  return COMMENT_BODIES[index % COMMENT_BODIES.length];
}

function buildCreatedAt(index: number, total: number): Date {
  const minutesBetween = 2 + (index % 5);
  const minutesAgo = minutesBetween * (total - index);
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}

function shuffle<T>(list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

async function seedComments() {
  const post = await fetchPostWithCoin();
  const holders = await loadHolderUsers(post.writer.coin!.id);
  if (holders.length === 0) {
    throw new Error(
      "No writer coin holders found; seed holders before seeding comments."
    );
  }

  const targetCount = normalizeCommentTarget(holders.length);
  const fakeUsersNeeded = Math.max(targetCount - holders.length, 0);
  const fakeUsers = await ensureFakeUsers(fakeUsersNeeded);

  if (fakeUsers.length !== fakeUsersNeeded) {
    throw new Error("Failed to provision the required number of fake users.");
  }

  const authors: Array<Pick<User, "id" | "displayName">> = shuffle([
    ...holders,
    ...fakeUsers,
  ]);
  if (authors.length !== targetCount) {
    throw new Error("Author pool does not match requested comment count.");
  }

  await prisma.comment.deleteMany({ where: { postId: post.id } });

  const commentsPayload = authors.map((author, index) => ({
    id: `comment_${index + 1}`,
    postId: post.id,
    userId: author.id,
    body: buildCommentBody(index),
    createdAt: buildCreatedAt(index, targetCount),
  }));

  await prisma.comment.createMany({ data: commentsPayload });

  console.log(
    `Seeded ${commentsPayload.length} comments. Holder commenters: ${holders.length}. Fake commenters: ${fakeUsers.length}.`
  );
}

seedComments()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
