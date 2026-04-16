import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getTrendingMovies, getPosterUrl } from "@/lib/tmdb";
import { ExploreClient } from "@/components/explore/explore-client";

export default async function ExplorePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [topLists, activeUsers, trendingRaw] = await Promise.all([
    prisma.movieList.findMany({
      where: { isPublic: true, movies: { some: {} } },
      orderBy: { movies: { _count: "desc" } },
      take: 6,
      include: {
        user: { select: { name: true, username: true, image: true } },
        _count: { select: { movies: true } },
        movies: {
          take: 4, orderBy: { order: "asc" },
          include: { movie: { select: { posterUrl: true } } },
        },
      },
    }),
    prisma.user.findMany({
      where: { lists: { some: { isPublic: true } } },
      take: 8,
      include: {
        _count: { select: { lists: true, followers: true } },
        lists: { where: { isPublic: true }, select: { _count: { select: { movies: true } } } },
      },
    }),
    getTrendingMovies().catch(() => ({ results: [] })),
  ]);

  const trending = trendingRaw.results.slice(0, 10).map(m => ({
    id: m.id, title: m.title,
    posterUrl: getPosterUrl(m.poster_path, "w300"),
    rating: m.vote_average, releaseDate: m.release_date,
  }));

  const usersWithCount = activeUsers
    .map(u => ({
      id: u.id, name: u.name, username: u.username, image: u.image,
      listCount: u._count.lists, followerCount: u._count.followers,
      movieCount: u.lists.reduce((s, l) => s + l._count.movies, 0),
    }))
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(0, 6);

  return <ExploreClient trending={trending} topLists={topLists as never} activeUsers={usersWithCount} />;
}
