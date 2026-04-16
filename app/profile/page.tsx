import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [user, totalMovies, genreStats, watchedCount, followerCount, followingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        lists: {
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
        _count: { select: { lists: true, likes: true } },
      },
    }),
    prisma.listMovie.count({ where: { list: { userId: session.user.id } } }),
    prisma.listMovie.findMany({
      where: { list: { userId: session.user.id } },
      include: { movie: { select: { genres: true } } },
    }),
    prisma.userMovieStatus.count({ where: { userId: session.user.id, status: "WATCHED" } }),
    prisma.follow.count({ where: { followingId: session.user.id } }),
    prisma.follow.count({ where: { followerId: session.user.id } }),
  ]);

  if (!user) redirect("/login");

  const genreMap: Record<string, number> = {};
  genreStats.forEach((lm) => {
    (lm.movie.genres || []).forEach((g) => { genreMap[g] = (genreMap[g] || 0) + 1; });
  });
  const topGenres = Object.entries(genreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  const stats = { totalMovies, watchedCount, topGenres, followerCount, followingCount };

  return <ProfileClient initialProfile={user as never} initialStats={stats} />;
}
