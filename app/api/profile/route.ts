import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(200).optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, totalMovies, genreStats, watchedCount, followerCount, followingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        lists: {
          include: {
            _count: { select: { movies: true } },
            movies: {
              take: 4,
              include: { movie: { select: { posterUrl: true, title: true } } },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
        _count: { select: { lists: true, likes: true } },
      },
    }),
    // Total movies across all lists
    prisma.listMovie.count({
      where: { list: { userId: session.user.id } },
    }),
    // Genre breakdown
    prisma.listMovie.findMany({
      where: { list: { userId: session.user.id } },
      include: { movie: { select: { genres: true } } },
    }),
    // Watched count
    prisma.userMovieStatus.count({
      where: { userId: session.user.id, status: "WATCHED" },
    }),
    prisma.follow.count({ where: { followingId: session.user.id } }),
    prisma.follow.count({ where: { followerId: session.user.id } }),
  ]);

  // Count genres
  const genreMap: Record<string, number> = {};
  genreStats.forEach(lm => {
    (lm.movie.genres || []).forEach(g => { genreMap[g] = (genreMap[g] || 0) + 1; });
  });
  const topGenres = Object.entries(genreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return NextResponse.json({ user, stats: { totalMovies, watchedCount, topGenres, followerCount, followingCount } });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { id: true, name: true, username: true, bio: true, image: true, email: true },
  });

  return NextResponse.json({ user });
}
