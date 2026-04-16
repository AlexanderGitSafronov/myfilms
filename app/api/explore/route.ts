import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTrendingMovies, getPosterUrl } from "@/lib/tmdb";

export async function GET() {
  const [topLists, activeUsers, trendingRaw] = await Promise.all([
    // Top public lists by movie count
    prisma.movieList.findMany({
      where: { isPublic: true, movies: { some: {} } },
      orderBy: { movies: { _count: "desc" } },
      take: 6,
      include: {
        user: { select: { name: true, username: true, image: true } },
        _count: { select: { movies: true } },
        movies: {
          take: 4,
          orderBy: { order: "asc" },
          include: { movie: { select: { posterUrl: true } } },
        },
      },
    }),
    // Most active users (by movie count in public lists)
    prisma.user.findMany({
      where: { lists: { some: { isPublic: true } } },
      take: 8,
      include: {
        _count: { select: { lists: true, followers: true } },
        lists: {
          where: { isPublic: true },
          select: { _count: { select: { movies: true } } },
        },
      },
    }),
    // Trending from TMDB
    getTrendingMovies().catch(() => ({ results: [] })),
  ]);

  const trending = trendingRaw.results.slice(0, 10).map((m) => ({
    id: m.id,
    title: m.title,
    posterUrl: getPosterUrl(m.poster_path, "w300"),
    rating: m.vote_average,
    releaseDate: m.release_date,
  }));

  // Sort active users by total movies
  const usersWithCount = activeUsers
    .map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
      listCount: u._count.lists,
      followerCount: u._count.followers,
      movieCount: u.lists.reduce((s, l) => s + l._count.movies, 0),
    }))
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(0, 6);

  return NextResponse.json({ trending, topLists, activeUsers: usersWithCount });
}
