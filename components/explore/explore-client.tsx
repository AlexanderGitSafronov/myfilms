"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, TrendingUp, List, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { formatRating, formatYear } from "@/lib/utils";
import { Star } from "lucide-react";

interface TrendingMovie {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  releaseDate: string | null;
}

interface TopList {
  id: string;
  name: string;
  slug: string;
  user: { name: string | null; username: string; image: string | null };
  _count: { movies: number };
  movies: { movie: { posterUrl: string | null } }[];
}

interface ActiveUser {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  listCount: number;
  followerCount: number;
  movieCount: number;
}

interface Props {
  trending: TrendingMovie[];
  topLists: TopList[];
  activeUsers: ActiveUser[];
}

export function ExploreClient({ trending, topLists, activeUsers }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <FadeUp>
        <div className="flex items-center gap-3 mb-2">
          <Compass className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Explore</h1>
        </div>
      </FadeUp>

      {/* Trending Movies */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Trending this week</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/tmdb-${movie.id}`}
                className="flex-shrink-0 w-28 group"
              >
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 mb-2 relative">
                  {movie.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🎬</div>
                  )}
                  {movie.rating > 0 && (
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1 py-0.5">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-yellow-400 font-medium">{formatRating(movie.rating)}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white font-medium line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                  {movie.title}
                </p>
                {movie.releaseDate && (
                  <p className="text-[10px] text-zinc-500 mt-0.5">{formatYear(movie.releaseDate)}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Lists */}
      {topLists.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <List className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Popular lists</h2>
          </div>
          <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLists.map((list) => {
              const posters = list.movies.map((m) => m.movie.posterUrl).filter(Boolean);
              return (
                <StaggerItem key={list.id}>
                  <Link
                    href={`/${list.user.username}/${list.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-colors group"
                  >
                    {/* Poster collage */}
                    <div className="aspect-[16/7] bg-zinc-900 relative overflow-hidden">
                      {posters.length > 0 ? (
                        <div className="flex h-full">
                          {posters.slice(0, 4).map((p, i) => (
                            <div key={i} className="flex-1 relative">
                              <Image src={p!} alt="" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-3xl">🎬</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors line-clamp-1">
                        {list.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar src={list.user.image} name={list.user.name} size="sm" />
                        <span className="text-xs text-zinc-400">{list.user.name || list.user.username}</span>
                        <Badge variant="secondary">{list._count.movies} films</Badge>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerList>
        </section>
      )}

      {/* Active Users */}
      {activeUsers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Active users</h2>
          </div>
          <StaggerList className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeUsers.map((user) => (
              <StaggerItem key={user.id}>
                <Link
                  href={`/${user.username}`}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors group"
                >
                  <Avatar src={user.image} name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors truncate">
                      {user.name || user.username}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">@{user.username}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-zinc-400">{user.movieCount} films</span>
                      <span className="text-[10px] text-zinc-600">·</span>
                      <span className="text-[10px] text-zinc-400">{user.listCount} lists</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>
      )}
    </div>
  );
}
