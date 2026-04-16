import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get IDs of users the current user follows
  const follows = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });

  const followingIds = follows.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return NextResponse.json({ items: [] });
  }

  // Get recent movies added to public lists by followed users
  const items = await prisma.listMovie.findMany({
    where: {
      list: {
        userId: { in: followingIds },
        isPublic: true,
      },
    },
    orderBy: { addedAt: "desc" },
    take: 50,
    include: {
      movie: true,
      list: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
        },
      },
    },
  });

  return NextResponse.json({ items });
}
