import { prisma } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";

// fixed value to seed data, fetch real price in balance checks later
const TOKEN_PRICE_USD = 0.0004514;

// exclude vault and uniswap pool (two largest holders)
const EXCLUDED_ADDRESSES = new Set([
  "0x1e55562233879e33aae8e1fd7b129a2154f7e8c8", // vault
  "0x498581ff718922c3f8e6a244956af099b2652b2b", // uniswap pool
]);

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const calculateTier = (balance: number): string | null => {
  const valueUsd = balance * TOKEN_PRICE_USD;
  // assuming patron >= $50, believer >= $10, supporter > $0
  if (valueUsd >= 50) return "patron";
  if (valueUsd >= 10) return "believer";
  if (valueUsd > 0) return "supporter";
  return null;
};

const parseCSV = (): Array<{ address: string; balance: string }> => {
  const csvPath = path.join(__dirname, "../token_holders.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n").slice(1); // skip header

  return lines.map((line) => {
    const [address, balanceStr] = line.split("\t");
    const balance = balanceStr.replace(/,/g, "");
    return { address: address.toLowerCase(), balance };
  });
};

const seedHolders = async () => {
  console.log("Parsing CSV...");
  const holders = parseCSV();
  console.log(`Found ${holders.length} holders in CSV`);

  // fetch writer coin
  const coin = await prisma.writerCoin.findUnique({
    where: { id: "coin_avc" },
  });

  if (!coin) {
    throw new Error("WriterCoin not found. Run seed.ts first.");
  }

  let created = 0;
  let skipped = 0;

  for (const holder of holders) {
    // skip excluded addresses (vault, uniswap pool)
    if (EXCLUDED_ADDRESSES.has(holder.address)) {
      skipped++;
      continue;
    }

    const balanceNum = parseFloat(holder.balance);
    if (balanceNum === 0) continue;

    const user = await prisma.user.upsert({
      where: { walletAddress: holder.address },
      update: {},
      create: {
        displayName: truncateAddress(holder.address),
        walletAddress: holder.address,
      },
    });

    await prisma.writerCoinHolding.upsert({
      where: {
        writerCoinId_userId: {
          writerCoinId: coin.id,
          userId: user.id,
        },
      },
      update: {
        balance: holder.balance,
        tier: calculateTier(balanceNum),
      },
      create: {
        writerCoinId: coin.id,
        userId: user.id,
        balance: holder.balance,
        tier: calculateTier(balanceNum),
      },
    });

    created++;
    if (created % 100 === 0) {
      console.log(`Progress: ${created}/${holders.length}`);
    }
  }

  console.log(`Created ${created} holders with balances - batch checks`);
  console.log("Seed holders complete!");
};

seedHolders()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
