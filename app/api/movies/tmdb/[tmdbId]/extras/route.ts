import { NextResponse } from "next/server";
import { getPosterUrl } from "@/lib/tmdb";

const TMDB_BASE = "https://api.themoviedb.org/3";

async function tmdbGet(path: string) {
  const res = await fetch(`${TMDB_BASE}${path}?language=ru-RU`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(_req: Request, { params }: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await params;

  const [videosData, similarData] = await Promise.all([
    tmdbGet(`/movie/${tmdbId}/videos`),
    tmdbGet(`/movie/${tmdbId}/similar`),
  ]);

  // Pick the best trailer (official YouTube trailer first)
  const trailer = videosData?.results?.find(
    (v: { site: string; type: string; official: boolean; key: string }) =>
      v.site === "YouTube" && v.type === "Trailer" && v.official
  )?.key ?? videosData?.results?.find(
    (v: { site: string; type: string; key: string }) => v.site === "YouTube" && v.type === "Trailer"
  )?.key ?? null;

  const similar = (similarData?.results ?? [])
    .slice(0, 12)
    .map((m: { id: number; title: string; poster_path: string | null; vote_average: number }) => ({
      id: m.id,
      title: m.title,
      posterUrl: getPosterUrl(m.poster_path, "w300"),
      rating: m.vote_average,
    }));

  return NextResponse.json({ trailer, similar });
}
