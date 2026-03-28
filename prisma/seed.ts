import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail =
    process.env.ADMIN_EMAIL || "stephen.helman@timeproofusa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Gjallarhorn2.0";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      branch: "El Paso",
      passwordHash: adminHash,
      profileComplete: true,
    },
  });
  console.log("Created admin:", admin.email);

  const repHash = await bcrypt.hash("timeproof2024", 12);
  const rep = await prisma.user.upsert({
    where: { email: "rep@timeproofusa.com" },
    update: {},
    create: {
      email: "rep@timeproofusa.com",
      name: "Test Rep",
      role: "REP",
      branch: "El Paso",
      passwordHash: repHash,
      profileComplete: true,
    },
  });
  console.log("Created rep:", rep.email);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
