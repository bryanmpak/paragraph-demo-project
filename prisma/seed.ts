import { prisma } from "@/lib/prisma";

const WRITER_COIN_ADDRESS = "0x06fc3d5d2369561e28f261148576520f5e49d6ea";

const seedPost = async () => {
  const writerUser = await prisma.user.create({
    data: {
      id: "user_avc",
      displayName: "AVC",
      avatarUrl: "/avc-avatar.jpg", // just store in codebase for this exercise
      walletAddress: "0xb8332710ab60a1b2e8fe6d775d83524c9e0ce136",
    },
  });

  const writer = await prisma.writer.create({
    data: {
      id: "writer_avc",
      userId: writerUser.id,
    },
  });

  const post = await prisma.post.create({
    data: {
      id: "post_gen_what",
      writerId: writer.id,
      title: "Gen What?",
      body: "",
    },
  });

  const coin = await prisma.writerCoin.create({
    data: {
      id: "coin_avc",
      writerId: writer.id,
      contractAddress: WRITER_COIN_ADDRESS,
      chainId: 8453,
    },
  });

  return { writerUser, writer, post, coin };
};

seedPost()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
