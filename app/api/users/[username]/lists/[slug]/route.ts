import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const list = await prisma.movieList.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      movies: {
        orderBy: { order: "asc" },
        include: { movie: true },
      },
      _count: { select: { movies: true } },
    },
  });

  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  const isOwner = session?.user?.id === list.userId;
  if (!list.isPublic && !isOwner) {
    return NextResponse.json({ error: "Private list" }, { status: 403 });
  }

  return NextResponse.json({ list, isOwner });
}
