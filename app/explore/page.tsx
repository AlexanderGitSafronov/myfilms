"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Compass, TrendingUp, Users, List, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { formatRating } from "@/lib/utils";
import { motion } from "framer-motion";

interface TrendingMovie { id: number; title: string; posterUrl: string | null; rating: number; releaseDate: string }
interface TopList {
  id: string; name: string; slug: string;
  user: { name: string | null; username: string; image: string | null };
  _count: { movies: number };
  movies: { movie: { posterUrl: string | null } }[];
}
interface ActiveUser {
  id: string; name: string | null; username: string; image: string | null;
  listCount: number; followerCount: number; movieCount: number;
}

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{ trending: TrendingMovie[]; topLists: TopList[]; activeUsers: ActiveUser[] } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/explore").then(r => r.json()).then(setData);
  }, [session]);

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="h-8 w-40 skeleton rounded-lg" />
        <div className="flex gap-3 overflow-hidden"><div className="h-44 w-28 skeleton rounded-xl flex-shrink-0" /><div className="h-44 w-28 skeleton rounded-xl flex-shrink-0" /><div className="h-44 w-28 skeleton rounded-xl flex-shrink-0" /></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <FadeUp>
        <div className="flex items-center gap-3 mb-8">
          <Compass className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Обзор</h1>
        </div>
      </FadeUp>

      {/* Trending */}
      {data.trending.length > 0 && (
        <FadeUp delay={0.05}>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Сейчас в тренде</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {data.trending.map((m, i) => (
                <motion.a
                  key={m.id}
                  href={`/search?q=${encodeURIComponent(m.title)}`}
                  className="flex-shrink-0 w-28 group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 mb-2 shadow-lg">
                    {m.posterUrl && <Image src={m.posterUrl} alt={m.title} fill className="object-cover" sizes="112px" />}
                    <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-xs font-bold text-white">
                      #{i + 1}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-white transition-colors line-clamp-2 leading-snug">{m.title}</p>
                  {m.rating > 0 && (
                    <p className="text-xs text-yellow-400 mt-0.5 flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow-400" />{formatRating(m.rating)}
                    </p>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* Top Lists */}
      {data.topLists.length > 0 && (
        <FadeUp delay={0.1}>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <List className="h-4 w-4 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Популярные списки</h2>
            </div>
            <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topLists.map((list) => {
                const posters = list.movies.map(m => m.movie.posterUrl).filter(Boolean).slice(0, 4);
                return (
                  <StaggerItem key={list.id}>
                    <Link href={`/${list.user.username}/${list.slug}`} className="group block rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all overflow-hidden">
                      {/* Poster collage */}
                      <div className="aspect-[16/7] bg-zinc-900 relative overflow-hidden">
                        {posters.length > 0 ? (
                          <div className={`grid h-full ${posters.length >= 4 ? "grid-cols-4" : posters.length >= 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                            {posters.map((url, i) => (
                              <div key={i} className="relative overflow-hidden">
                                <Image src={url!} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">🎬</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors truncate">{list.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar src={list.user.image} name={list.user.name} size="xs" />
                          <span className="text-xs text-zinc-500">@{list.user.username}</span>
                          <span className="text-xs text-zinc-600 ml-auto">{list._count.movies} фильмов</span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerList>
          </div>
        </FadeUp>
      )}

      {/* Active users */}
      {data.activeUsers.length > 0 && (
        <FadeUp delay={0.15}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Активные пользователи</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.activeUsers.map((user) => (
                <Link key={user.id} href={`/${user.username}`} className="group flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all">
                  <Avatar src={user.image} name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm group-hover:text-red-400 transition-colors truncate">{user.name || user.username}</p>
                    <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{user.movieCount} фильмов</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  );
}
