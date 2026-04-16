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

// Search TMDB by title (tries ru then en)
async function searchByTitle(title: string, year?: string): Promise<TMDBMovie | null> {
  const params: Record<string, string> = { query: title };
  if (year) params.year = year;

  // Try Russian first (better for CIS sites)
  const ruResult = await tmdbFetch<TMDBSearchResult>("/search/movie", {
    ...params,
    language: "ru-RU",
  });
  if (ruResult.results.length > 0) return ruResult.results[0];

  // Fallback: English
  const enResult = await tmdbFetch<TMDBSearchResult>("/search/movie", params);
  if (enResult.results.length > 0) return enResult.results[0];

  return null;
}

// Parse og:title / title from any webpage and clean it up
async function extractTitleFromPage(url: string): Promise<{ title: string; year?: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyFilms/1.0)",
        "Accept-Language": "ru-RU,ru;q=0.9,uk;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Extract og:title
    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1];

    // Fallback to <title>
    const pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    let raw = ogTitle || pageTitle || "";

    // Decode HTML entities
    raw = raw
      .replace(/&#34;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!raw) return null;

    // Extract year if present (2020–2030)
    const yearMatch = raw.match(/\b(20[12]\d)\b/);
    const year = yearMatch?.[1];

    // Common suffixes to strip (site names, watch phrases, etc.)
    const stripPatterns = [
      /\s*[-–|·•]\s*(Multiplex|MEGOGO|Megogo|Кинопоиск|КиноПоиск|IMDb|IMDB|Netflix|Amazon|Apple TV|YouTube|Дивитись онлайн|Смотреть онлайн|онлайн|online|HD|UHD|4K|афіша|афиша|розклад|расписание|квитки|билеты|кінотеатр|кинотеатр|Мультиплекс|KinoPoisk|Kinopoisk).*$/gi,
      /\s*\|\s*[^|]{1,40}$/,          // strip last "| Site Name" segment
      /^(Дивитись|Смотреть|Watch)\s+/i, // strip leading watch verbs
      /\s*\(\s*(?:трейлер|trailer|teaser)\s*\)/gi,
    ];

    let title = raw;
    for (const pattern of stripPatterns) {
      title = title.replace(pattern, "").trim();
    }

    // If the title still has parentheses with year at the end, that's fine
    title = title.trim();

    return title ? { title, year } : null;
  } catch {
    return null;
  }
}

// Extract TMDB ID from various URLs — supports TMDB, IMDB, and any site via og:title
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

    // Generic: fetch page and extract title from meta tags
    const extracted = await extractTitleFromPage(url);
    if (!extracted) return null;

    const movie = await searchByTitle(extracted.title, extracted.year);
    if (movie) return await getMovieById(movie.id); // fetch full details with genres
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
