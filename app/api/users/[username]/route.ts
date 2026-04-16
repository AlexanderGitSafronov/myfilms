import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      lists: {
        where: session?.user?.id
          ? { OR: [{ isPublic: true }, { userId: session.user.id }] }
          : { isPublic: true },
        include: {
          _count: { select: { movies: true } },
          movies: {
            take: 4,
            orderBy: { order: "asc" },
            include: { movie: { select: { posterUrl: true, title: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      _count: { select: { lists: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
