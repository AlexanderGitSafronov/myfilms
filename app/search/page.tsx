"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Plus, Users, UserPlus, UserCheck, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatYear, formatRating } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

interface MovieResult {
  tmdbId: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseDate: string;
  rating: number;
  genres: string[];
}

interface UserResult {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  bio: string | null;
  _count: { lists: number; followers: number };
  followers: { id: string }[];
}

type Tab = "movies" | "users";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useI18n();

  const initialTab = (searchParams.get("tab") as Tab) || "movies";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [movieResults, setMovieResults] = useState<MovieResult[]>([]);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setQuery(q); doSearch(q, tab); }
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (timeout.current) clearTimeout(timeout.current);
    if (!value.trim()) { setMovieResults([]); setUserResults([]); return; }
    timeout.current = setTimeout(() => {
      router.replace(`/search?q=${encodeURIComponent(value)}&tab=${tab}`, { scroll: false });
      doSearch(value, tab);
    }, 400);
  }

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setMovieResults([]);
    setUserResults([]);
    if (query.trim()) {
      router.replace(`/search?q=${encodeURIComponent(query)}&tab=${newTab}`, { scroll: false });
      doSearch(query, newTab);
    }
  }

  async function doSearch(q: string, currentTab: Tab) {
    setSearching(true);
    if (currentTab === "movies") {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
      if (res.ok) { const d = await res.json(); setMovieResults(d.results || []); }
    } else {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const d = await res.json();
        const users: UserResult[] = d.users || [];
        setUserResults(users);
        const map: Record<string, boolean> = {};
        users.forEach((u) => { map[u.username] = u.followers.length > 0; });
        setFollowingMap(map);
      }
    }
    setSearching(false);
  }

  async function toggleFollow(username: string) {
    if (!session) { router.push("/login"); return; }
    const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setFollowingMap((m) => ({ ...m, [username]: data.following }));
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">{t("search")}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            className="pl-10"
            placeholder={tab === "movies" ? t("searchPlaceholder") : "Поиск пользователей..."}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            autoFocus
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-white/10 p-1 mb-6 bg-white/[0.02]">
        <button
          onClick={() => handleTabChange("movies")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${tab === "movies" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
        >
          <Film className="h-4 w-4" />
          Фильмы
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${tab === "users" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
        >
          <Users className="h-4 w-4" />
          Пользователи
        </button>
      </div>

      {/* Movie results */}
      {tab === "movies" && (
        movieResults.length > 0 ? (
          <div className="space-y-3">
            {movieResults.map((movie) => (
              <div key={movie.tmdbId} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="relative h-24 w-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  {movie.posterUrl ? (
                    <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🎬</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">{movie.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-zinc-500">{formatYear(movie.releaseDate)}</span>
                    {movie.rating > 0 && (
                      <span className="flex items-center gap-1 text-sm text-yellow-400">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        {formatRating(movie.rating)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genres.slice(0, 3).map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
                  </div>
                  {movie.overview && (
                    <p className="text-xs text-zinc-500 line-clamp-2">{movie.overview}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Link href={`/add-movie?q=${encodeURIComponent(movie.title)}`}>
                    <Button size="sm" className="text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {t("add")}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : query && !searching ? (
          <div className="text-center py-16 text-zinc-500">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>{t("noResults")} &quot;{query}&quot;</p>
          </div>
        ) : !query ? (
          <div className="text-center py-16 text-zinc-600">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>{t("startTyping")}</p>
          </div>
        ) : null
      )}

      {/* User results */}
      {tab === "users" && (
        userResults.length > 0 ? (
          <div className="space-y-3">
            {userResults.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <Link href={`/${user.username}`}>
                  <Avatar src={user.image} name={user.name} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/${user.username}`} className="font-semibold text-white hover:text-red-400 transition-colors">
                    {user.name}
                  </Link>
                  <p className="text-sm text-zinc-500">@{user.username}</p>
                  {user.bio && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{user.bio}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-600">{user._count.lists} списков</span>
                    <span className="text-xs text-zinc-600">{user._count.followers} подписчиков</span>
                  </div>
                </div>
                {session && (
                  <Button
                    size="sm"
                    variant={followingMap[user.username] ? "outline" : "default"}
                    onClick={() => toggleFollow(user.username)}
                    className="flex-shrink-0"
                  >
                    {followingMap[user.username] ? (
                      <><UserCheck className="h-3.5 w-3.5 mr-1.5" />Подписан</>
                    ) : (
                      <><UserPlus className="h-3.5 w-3.5 mr-1.5" />Подписаться</>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : query && !searching ? (
          <div className="text-center py-16 text-zinc-500">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Пользователей не найдено по &quot;{query}&quot;</p>
          </div>
        ) : !query ? (
          <div className="text-center py-16 text-zinc-600">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Введите имя или ник пользователя</p>
          </div>
        ) : null
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
