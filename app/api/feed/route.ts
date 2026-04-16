import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  const items = await prisma.listMovie.findMany({
    where: {
      list: {
        isPublic: true,
        userId: { not: session.user.id }, // hide own movies from feed
      },
    },
    orderBy: { addedAt: "desc" },
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          rating: true,
          releaseDate: true,
          genres: true,
          runtime: true,
          overview: true,
        },
      },
      list: {
        select: {
          id: true,
          name: true,
          slug: true,
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      },
    },
  });

  const nextCursor = items.length === 20 ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}
