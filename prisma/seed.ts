import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const hashedPassword = await bcrypt.hash("demo123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@myfilms.com" },
    update: {},
    create: {
      name: "Demo User",
      username: "demo",
      email: "demo@myfilms.com",
      password: hashedPassword,
      bio: "Just here to share great movies 🎬",
      lists: {
        create: [
          {
            name: "Watch Later",
            slug: "watch-later",
            description: "Movies I want to watch",
            isPublic: false,
          },
          {
            name: "All-Time Favorites",
            slug: "favorites",
            description: "The films I love most",
            isPublic: true,
          },
          {
            name: "Recommended",
            slug: "recommended",
            description: "Must-watch films for everyone",
            isPublic: true,
          },
        ],
      },
    },
  });

  console.log(`✅ Created demo user: ${user.email}`);
  console.log("   Email: demo@myfilms.com");
  console.log("   Password: demo123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
