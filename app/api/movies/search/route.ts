import { NextResponse } from "next/server";
import { searchMovies, fetchMovieFromUrl, getPosterUrl, getBackdropUrl, GENRE_MAP, PageMovieResult } from "@/lib/tmdb";
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

      // Page scrape result (any non-TMDB site)
      if ("_type" in movie && movie._type === "page") {
        return NextResponse.json({
          results: [formatPageMovie(movie)],
        });
      }

      // TMDB result
      return NextResponse.json({
        results: [formatTmdbMovie(movie as TMDBMovie)],
      });
    }

    const data = await searchMovies(query!);
    return NextResponse.json({
      results: data.results.slice(0, 10).map(formatTmdbMovie),
      total: data.total_results,
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
