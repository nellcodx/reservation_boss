import "dotenv/config";
import { PrismaClient, TableStatus } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.restaurantTable.count();
  if (existing > 0) return;

  await prisma.restaurantTable.createMany({
    data: [
      { name: "T1", capacity: 2, x: 2, y: 2, status: TableStatus.FREE },
      { name: "T2", capacity: 2, x: 6, y: 2, status: TableStatus.FREE },
      { name: "T3", capacity: 4, x: 2, y: 6, status: TableStatus.FREE },
      { name: "T4", capacity: 4, x: 6, y: 6, status: TableStatus.FREE },
      { name: "T5", capacity: 6, x: 10, y: 2, status: TableStatus.FREE },
      { name: "T6", capacity: 6, x: 10, y: 6, status: TableStatus.FREE }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

