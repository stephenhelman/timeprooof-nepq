import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@timeproofusa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "timeproof2026";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      branch: "Main",
      passwordHash: adminHash,
      profileComplete: true,
      isActive: true,
      mustChangePassword: false,
    },
  });
  console.log("Created admin:", admin.email);

  const repHash = await bcrypt.hash("timeproof2024", 12);
  const rep = await prisma.user.upsert({
    where: { email: "rep@timeproofusa.com" },
    update: {},
    create: {
      email: "rep@timeproofusa.com",
      firstName: "Test",
      lastName: "Rep",
      role: "REP",
      branch: "El Paso",
      passwordHash: repHash,
      profileComplete: true,
      isActive: true,
      mustChangePassword: false,
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
