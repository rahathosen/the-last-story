import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating loves table...");
    
    // Execute raw SQL to create the table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS loves (
        id TEXT PRIMARY KEY,
        "storyId" TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        "viewerId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("storyId", "viewerId")
      );
    `);

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_loves_story_id ON loves("storyId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_loves_viewer_id ON loves("viewerId");
    `);

    console.log("Successfully created loves table and indexes!");
  } catch (error) {
    console.error("Error creating loves table:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
