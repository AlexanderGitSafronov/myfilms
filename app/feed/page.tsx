"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Rss, List, ChevronDown, Filter, X } from "lucide-react";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { formatYear, formatRating, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeedItem {
  id: string;
  note: string | null;
  addedAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl: string | null;
    rating: number | null;
    releaseDate: string | null;
    genres: string[];
    runtime: number | null;
    overview: string | null;
  };
  list: {
    id: string;
    name: string;
    slug: string;
    user: { id: string; name: string | null; username: string; image: string | null };
  };
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  // Collect all genres from loaded items for filter chips
  const allGenres = Array.from(new Set(items.flatMap(i => i.movie.genres))).slice(0, 12);
  const filtered = genreFilter ? items.filter(i => i.movie.genres.includes(genreFilter)) : items;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchFeed = useCallback(async (cursor?: string) => {
    const url = cursor ? `/api/feed?cursor=${cursor}` : "/api/feed";
    const res = await fetch(url);
    if (!res.ok) return;
    const d = await res.json();
    return d;
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchFeed().then((d) => {
      if (d) {
        setItems(d.items || []);
        setNextCursor(d.nextCursor || null);
      }
      setLoading(false);
    });
  }, [session, fetchFeed]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const d = await fetchFeed(nextCursor);
    if (d) {
      setItems((prev) => [...prev, ...(d.items || [])]);
      setNextCursor(d.nextCursor || null);
    }
    setLoadingMore(false);
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Rss className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Лента</h1>
      </div>

      <FadeUp>
        {/* Genre filters */}
        {allGenres.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            <button
              onClick={() => setGenreFilter(null)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !genreFilter ? "bg-red-600/20 border-red-600/40 text-red-400" : "border-white/10 text-zinc-400 hover:border-white/20"
              }`}
            >
              <Filter className="h-3 w-3" />Все
            </button>
            {allGenres.map(g => (
              <button
                key={g}
                onClick={() => setGenreFilter(g === genreFilter ? null : g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  genreFilter === g ? "bg-red-600/20 border-red-600/40 text-red-400" : "border-white/10 text-zinc-400 hover:border-white/20"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Rss className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">Лента пуста</p>
            <p className="text-zinc-600 text-sm mt-1">
              Пока никто не добавил фильмы в публичные списки
            </p>
          </div>
        ) : (
          <>
            <StaggerList className="space-y-4">
              {filtered.map((item) => (
                <StaggerItem key={item.id}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/15 transition-colors">

                    {/* User row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <Link href={`/${item.list.user.username}`} className="flex-shrink-0">
                        <Avatar src={item.list.user.image} name={item.list.user.name} size="sm" />
                      </Link>
                      <div className="flex-1 min-w-0 text-sm">
                        <Link
                          href={`/${item.list.user.username}`}
                          className="font-semibold text-white hover:text-red-400 transition-colors"
                        >
                          {item.list.user.name || item.list.user.username}
                        </Link>
                        <span className="text-zinc-500"> добавил в </span>
                        <Link
                          href={`/${item.list.user.username}/${item.list.slug}`}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors font-medium"
                        >
                          <List className="h-3 w-3 flex-shrink-0" />
                          {item.list.name}
                        </Link>
                      </div>
                      <span className="text-xs text-zinc-600 flex-shrink-0">{formatDate(item.addedAt)}</span>
                    </div>

                    {/* Movie row */}
                    <Link href={`/movies/${item.movie.id}`} className="flex gap-3 group">
                      <div className="relative h-24 w-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        {item.movie.posterUrl ? (
                          <Image
                            src={item.movie.posterUrl}
                            alt={item.movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl">🎬</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white group-hover:text-red-400 transition-colors leading-snug">
                          {item.movie.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {item.movie.releaseDate && (
                            <span className="text-xs text-zinc-500">{formatYear(item.movie.releaseDate)}</span>
                          )}
                          {item.movie.rating ? (
                            <span className="flex items-center gap-1 text-xs text-yellow-400">
                              <Star className="h-3 w-3 fill-yellow-400" />
                              {formatRating(item.movie.rating)}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.movie.genres.slice(0, 3).map((g) => (
                            <Badge key={g} variant="secondary">{g}</Badge>
                          ))}
                        </div>
                        {item.movie.overview && (
                          <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2">{item.movie.overview}</p>
                        )}
                      </div>
                    </Link>

                    {/* Note */}
                    {item.note && (
                      <p className="mt-3 text-sm text-zinc-400 italic border-l-2 border-red-600/30 pl-3">
                        {item.note}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>

            {/* Load more */}
            {nextCursor && (
              <div className="flex justify-center mt-6">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? (
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    )}
                    Загрузить ещё
                  </Button>
                </motion.div>
              </div>
            )}
          </>
        )}
      </FadeUp>
    </div>
  );
}
