import { NextResponse } from "next/server";
import { searchMovies, fetchMovieFromUrl, getPosterUrl, getBackdropUrl, GENRE_MAP } from "@/lib/tmdb";

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
      return NextResponse.json({
        results: [formatMovie(movie)],
      });
    }

    const data = await searchMovies(query!);
    return NextResponse.json({
      results: data.results.slice(0, 10).map(formatMovie),
      total: data.total_results,
    });
  } catch {
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}

function formatMovie(movie: Parameters<typeof getPosterUrl>[0] extends string ? never : { id: number; title: string; original_title: string; overview: string; poster_path: string | null; backdrop_path: string | null; release_date: string; vote_average: number; vote_count: number; genre_ids?: number[]; genres?: { id: number; name: string }[]; runtime?: number; original_language: string }) {
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
  };
}
