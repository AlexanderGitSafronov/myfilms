"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Rss } from "lucide-react";
import { formatYear, formatRating, formatDate } from "@/lib/utils";

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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => { setItems(d.items || []); setLoading(false); });
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl" />
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

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Rss className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">Лента пуста</p>
          <p className="text-zinc-600 text-sm mt-1">
            Подпишитесь на друзей, чтобы видеть их рекомендации
          </p>
          <Link
            href="/search?tab=users"
            className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Найти друзей
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              {/* Who added */}
              <div className="flex items-center gap-2 mb-3">
                <Link href={`/${item.list.user.username}`}>
                  <Avatar src={item.list.user.image} name={item.list.user.name} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-zinc-300">
                    <Link href={`/${item.list.user.username}`} className="font-medium text-white hover:text-red-400 transition-colors">
                      {item.list.user.name}
                    </Link>
                    {" добавил в "}
                    <Link href={`/${item.list.user.username}/${item.list.slug}`} className="text-red-400 hover:underline">
                      {item.list.name}
                    </Link>
                  </span>
                </div>
                <span className="text-xs text-zinc-600 flex-shrink-0">{formatDate(item.addedAt)}</span>
              </div>

              {/* Movie */}
              <Link href={`/movies/${item.movie.id}`} className="flex gap-3 group">
                <div className="relative h-20 w-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  {item.movie.posterUrl ? (
                    <Image src={item.movie.posterUrl} alt={item.movie.title} fill className="object-cover" />
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
                    {item.movie.genres.slice(0, 2).map((g) => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Note */}
              {item.note && (
                <p className="mt-3 text-sm text-zinc-400 italic border-l-2 border-white/10 pl-3">
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
