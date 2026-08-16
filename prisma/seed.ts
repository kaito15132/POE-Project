import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.applicationSetting.upsert({
    where: { key: "freshness.freshHours" },
    update: {},
    create: {
      key: "freshness.freshHours",
      value: "12",
      description: "User-configurable assumption; fresh observation threshold in hours",
    },
  });

  await prisma.applicationSetting.upsert({
    where: { key: "freshness.staleHours" },
    update: {},
    create: {
      key: "freshness.staleHours",
      value: "48",
      description: "User-configurable assumption; stale observation threshold in hours",
    },
  });

  console.log("Seeded 2 application settings.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
