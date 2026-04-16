const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  original_language: string;
}

export interface TMDBSearchResult {
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("language", "en-US");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export function getPosterUrl(path: string | null, size: "w300" | "w500" | "original" = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w1280${path}`;
}

export async function searchMovies(query: string): Promise<TMDBSearchResult> {
  return tmdbFetch<TMDBSearchResult>("/search/movie", { query });
}

export async function getMovieById(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${id}`, { append_to_response: "genres" });
}

export async function getPopularMovies(): Promise<TMDBSearchResult> {
  return tmdbFetch<TMDBSearchResult>("/movie/popular");
}

export async function getTrendingMovies(): Promise<TMDBSearchResult> {
  return tmdbFetch<TMDBSearchResult>("/trending/movie/week");
}

// Extract TMDB ID from various URLs (IMDB, TMDB, etc.)
export async function fetchMovieFromUrl(url: string): Promise<TMDBMovie | null> {
  try {
    // TMDB URL: themoviedb.org/movie/12345
    const tmdbMatch = url.match(/themoviedb\.org\/movie\/(\d+)/);
    if (tmdbMatch) {
      return await getMovieById(parseInt(tmdbMatch[1]));
    }

    // IMDB URL: imdb.com/title/tt1234567
    const imdbMatch = url.match(/imdb\.com\/title\/(tt\d+)/);
    if (imdbMatch) {
      const result = await tmdbFetch<{ movie_results: TMDBMovie[] }>(
        `/find/${imdbMatch[1]}`,
        { external_source: "imdb_id" }
      );
      return result.movie_results[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
