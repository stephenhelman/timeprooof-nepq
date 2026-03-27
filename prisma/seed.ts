import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@timeproofusa.com" },
    update: {},
    create: {
      email: "admin@timeproofusa.com",
      name: "Admin User",
      role: "ADMIN",
      branch: "El Paso",
    },
  });
  console.log("Created admin:", admin.email);

  // Rep user
  const rep = await prisma.user.upsert({
    where: { email: "rep@timeproofusa.com" },
    update: {},
    create: {
      email: "rep@timeproofusa.com",
      name: "Test Rep",
      role: "REP",
      branch: "El Paso",
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
