import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MovieClient } from "@/components/movies/movie-client";

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true, image: true, username: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true } },
    },
  });

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
