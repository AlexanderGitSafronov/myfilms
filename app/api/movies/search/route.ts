import { NextResponse } from "next/server";
import { searchMovies, fetchMovieFromUrl, getPosterUrl, getBackdropUrl, GENRE_MAP, PageMovieResult } from "@/lib/tmdb";
import { prisma } from "@/lib/db";
import type { TMDBMovie } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const url = searchParams.get("url");

  if (!query && !url) {
    return NextResponse.json({ error: "Query or URL required" }, { status: 400 });
  }

  try {
    if (url) {
      const movie = await fetchMovieFromUrl(url);
      if (!movie) {
        return NextResponse.json({ error: "Could not fetch movie from URL" }, { status: 404 });
      }

      if ("_type" in movie && movie._type === "page") {
        return NextResponse.json({ results: [formatPageMovie(movie)] });
      }

      return NextResponse.json({ results: [formatTmdbMovie(movie as TMDBMovie)] });
    }

    // Search TMDB and local DB in parallel
    const [tmdbData, localMovies] = await Promise.all([
      searchMovies(query!).catch(() => ({ results: [], total_results: 0 })),
      prisma.movie.findMany({
        where: {
          title: { contains: query!, mode: "insensitive" },
        },
        take: 10,
        orderBy: { title: "asc" },
      }),
    ]);

    const tmdbResults = tmdbData.results.slice(0, 10).map(formatTmdbMovie);

    // Format local movies (skip those already in TMDB results)
    const tmdbIds = new Set(tmdbResults.map((m) => m.tmdbId).filter(Boolean));
    const localResults = localMovies
      .filter((m) => !m.tmdbId || !tmdbIds.has(m.tmdbId))
      .map((m) => ({
        tmdbId: m.tmdbId,
        title: m.title,
        originalTitle: m.originalTitle,
        overview: m.overview,
        posterUrl: m.posterUrl,
        backdropUrl: m.backdropUrl,
        releaseDate: m.releaseDate,
        rating: m.rating ?? 0,
        voteCount: m.voteCount ?? 0,
        genres: m.genres ?? [],
        runtime: m.runtime,
        language: m.language,
        sourceUrl: m.sourceUrl,
        localId: m.id,
      }));

    // Local results first if they match better, then TMDB
    const combined = [...localResults, ...tmdbResults].slice(0, 15);

    return NextResponse.json({
      results: combined,
      total: combined.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}

function formatPageMovie(movie: PageMovieResult) {
  return {
    tmdbId: null,
    title: movie.title,
    originalTitle: movie.title,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    backdropUrl: null,
    releaseDate: movie.releaseDate || null,
    rating: 0,
    voteCount: 0,
    genres: [],
    runtime: null,
    language: null,
    sourceUrl: movie.sourceUrl,
  };
}

function formatTmdbMovie(movie: TMDBMovie) {
  const genres = movie.genres?.map((g) => g.name) ||
    (movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) ?? []);

  return {
    tmdbId: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterUrl: getPosterUrl(movie.poster_path),
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    releaseDate: movie.release_date,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    genres,
    runtime: movie.runtime,
    language: movie.original_language,
    sourceUrl: null,
  };
}
