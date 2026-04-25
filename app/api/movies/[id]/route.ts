import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const listId = searchParams.get("listId");

  if (!listId) {
    return NextResponse.json({ error: "listId required" }, { status: 400 });
  }

  // Verify list ownership
  const list = await prisma.movieList.findFirst({
    where: { id: listId, userId: session.user.id },
  });
  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.listMovie.deleteMany({
    where: { movieId: id, listId },
  });

  return NextResponse.json({ success: true });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let movie;
  try {
    movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            user: { select: { id: true, name: true, image: true, username: true } },
            replies: {
              include: { user: { select: { id: true, name: true, image: true, username: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true } },
      },
    });
  } catch {
    movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { id: true, name: true, image: true, username: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true } },
      },
    });
  }

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  const session = await auth();
  let userLiked = false;
  if (session?.user?.id) {
    const like = await prisma.movieLike.findUnique({
      where: { userId_movieId: { userId: session.user.id, movieId: id } },
    });
    userLiked = !!like;
  }

  return NextResponse.json({ movie, likeCount: movie._count.likes, userLiked });
}
