import { prisma } from "@/lib/db";

// One-shot, idempotent in-app migrations for schema changes that haven't
// been applied via prisma db push / migrate deploy yet.
//
// Each ALTER TABLE … IF NOT EXISTS / CREATE INDEX … IF NOT EXISTS is a
// no-op once the change exists, so the cost is negligible after the first
// successful run per Node process.

let ran = false;

export async function ensureSchemaUpToDate() {
  if (ran) return;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" TEXT`
    );
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId")`
    );
    ran = true;
  } catch (err) {
    console.error("ensureSchemaUpToDate failed", err);
  }
}
