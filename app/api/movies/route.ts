import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadImageFromUrl } from "@/lib/cloudinary";
import { z } from "zod";

const addMovieSchema = z.object({
  listId: z.string(),
  tmdbId: z.number().optional(),
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  overview: z.string().optional(),
  posterUrl: z.string().url().optional().nullable(),
  backdropUrl: z.string().url().optional().nullable(),
  releaseDate: z.string().optional(),
  rating: z.number().optional(),
  voteCount: z.number().optional(),
  genres: z.array(z.string()).optional(),
  runtime: z.number().optional(),
  language: z.string().optional(),
  sourceUrl: z.string().url().optional().nullable(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addMovieSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { listId, note, ...movieData } = parsed.data;

    // Verify the list belongs to the user
    const list = await prisma.movieList.findFirst({
      where: { id: listId, userId: session.user.id },
    });
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Check if movie already exists (by tmdbId)
    let movie = movieData.tmdbId
      ? await prisma.movie.findUnique({ where: { tmdbId: movieData.tmdbId } })
      : null;

    if (!movie) {
      // Upload poster to Cloudinary
      let cloudinaryPosterUrl = movieData.posterUrl || null;
      if (movieData.posterUrl) {
        const uploaded = await uploadImageFromUrl(movieData.posterUrl);
        if (uploaded) cloudinaryPosterUrl = uploaded;
      }

      movie = await prisma.movie.create({
        data: {
          ...movieData,
          posterUrl: cloudinaryPosterUrl,
          genres: movieData.genres || [],
        },
      });
    }

    // Check if already in list
    const existing = await prisma.listMovie.findUnique({
      where: { listId_movieId: { listId, movieId: movie.id } },
    });

    if (existing) {
      return NextResponse.json({ error: "Movie already in list" }, { status: 409 });
    }

    const maxOrder = await prisma.listMovie.aggregate({
      where: { listId },
      _max: { order: true },
    });

    const listMovie = await prisma.listMovie.create({
      data: {
        listId,
        movieId: movie.id,
        order: (maxOrder._max.order ?? -1) + 1,
        note,
      },
      include: { movie: true },
    });

    return NextResponse.json({ listMovie }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
