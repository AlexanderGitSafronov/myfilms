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

// Result from scraping any webpage
export interface PageMovieResult {
  _type: "page";
  title: string;
  overview: string;
  posterUrl: string | null;
  sourceUrl: string;
  releaseDate?: string;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Fetch any webpage and extract movie metadata from og: tags
async function scrapePageMetadata(url: string): Promise<PageMovieResult | null> {
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

    // Helper to get a meta tag value
    const getMeta = (property: string): string => {
      const m = html.match(new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"
      )) || html.match(new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"
      ));
      return m ? decodeHtmlEntities(m[1]) : "";
    };

    const getMetaName = (name: string): string => {
      const m = html.match(new RegExp(
        `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"
      )) || html.match(new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"
      ));
      return m ? decodeHtmlEntities(m[1]) : "";
    };

    // Get og:title or page title
    let rawTitle = getMeta("og:title");
    if (!rawTitle) {
      const pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
      rawTitle = decodeHtmlEntities(pageTitle);
    }

    if (!rawTitle) return null;

    // Clean title — strip site name suffixes
    const stripPatterns = [
      /\s*[-–|·•]\s*(Multiplex|MEGOGO|Megogo|Кинопоиск|КиноПоиск|IMDb|IMDB|Netflix|Amazon|Apple\s*TV|YouTube|Дивитись онлайн|Смотреть онлайн|онлайн|online|HD|UHD|4K|афіша|афиша|розклад|расписание|квитки|билеты|кінотеатр|кинотеатр|Мультиплекс|KinoPoisk|Kinopoisk|Megogo|Sweet\.tv|Ivi|ivi).*$/gi,
      /\s*\|\s*[^|]{1,50}$/,
      /^(Дивитись|Смотреть|Watch)\s+/i,
      /\s*\(\s*(трейлер|trailer|teaser)\s*\)/gi,
    ];
    let title = rawTitle;
    for (const p of stripPatterns) title = title.replace(p, "").trim();
    if (!title) return null;

    // Extract year from raw title or page title
    const yearMatch = rawTitle.match(/\b(20[12]\d)\b/) || html.match(/<title[^>]*>[^<]*(20[12]\d)/i);
    const year = yearMatch?.[1];

    const overview = getMeta("og:description") || getMetaName("description") || "";
    const posterUrl = getMeta("og:image") || null;

    return {
      _type: "page",
      title,
      overview,
      posterUrl: posterUrl || null,
      sourceUrl: url,
      releaseDate: year ? `${year}-01-01` : undefined,
    };
  } catch {
    return null;
  }
}

// Extract movie info from URL — supports TMDB, IMDB, and any site via og: tags
export async function fetchMovieFromUrl(url: string): Promise<TMDBMovie | PageMovieResult | null> {
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

    // Any other URL — scrape og: metadata from the page
    return await scrapePageMetadata(url);
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
