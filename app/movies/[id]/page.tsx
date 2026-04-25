import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MovieClient } from "@/components/movies/movie-client";

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

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
    // Fallback when Comment.parentId column hasn't been migrated to DB.
    // Use explicit select to avoid touching the missing column.
    const fallback = await prisma.movie.findUnique({
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
    movie = fallback;
  }

  if (!movie) notFound();

  let userLiked = false;
  if (session?.user?.id) {
    const like = await prisma.movieLike.findUnique({
      where: { userId_movieId: { userId: session.user.id, movieId: id } },
    });
    userLiked = !!like;
  }

  return (
    <MovieClient
      movie={movie as never}
      initialLikeCount={movie._count.likes}
      initialUserLiked={userLiked}
    />
  );
}
