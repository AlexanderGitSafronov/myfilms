"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Link as LinkIcon, Star, Check, ChevronDown, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatYear, formatRating, formatRuntime } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

interface SearchResult {
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: string[];
  runtime?: number;
  language: string;
}

interface MovieList {
  id: string;
  name: string;
  slug: string;
}

function AddMovieContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useI18n();

  const [mode, setMode] = useState<"search" | "url">("search");
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [lists, setLists] = useState<MovieList[]>([]);
  const [selectedListId, setSelectedListId] = useState(searchParams.get("listId") || "");
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<SearchResult>>({});
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/lists")
        .then((r) => r.json())
        .then((d) => {
          setLists(d.lists || []);
          if (!selectedListId && d.lists?.length > 0) {
            setSelectedListId(d.lists[0].id);
          }
        });
    }
  }, [session]);

  function handleSearchInput(value: string) {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) { setResults([]); return; }
    searchTimeout.current = setTimeout(() => doSearch(value), 400);
  }

  async function doSearch(q: string) {
    setSearching(true);
    const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data.results || []);
    }
    setSearching(false);
  }

  async function handleUrlSearch() {
    if (!url.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/movies/search?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results?.length > 0) {
        handleSelect(data.results[0]);
      } else {
        toast(t("couldNotFindMovie"), "error");
      }
    } else {
      toast(t("failedToFetch"), "error");
    }
    setSearching(false);
  }

  function handleSelect(movie: SearchResult) {
    setSelected(movie);
    setEditData(movie);
    setResults([]);
    setQuery("");
  }

  async function handleAdd() {
    if (!selected || !selectedListId) return;
    setAdding(true);

    const movieData = editing ? { ...selected, ...editData } : selected;

    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...movieData,
        listId: selectedListId,
        note: note || undefined,
      }),
    });

    if (res.ok) {
      toast(t("movieAdded"), "success");
      router.push(`/lists/${selectedListId}`);
    } else {
      const data = await res.json();
      toast(data.error || t("failedToAdd"), "error");
      setAdding(false);
    }
  }

  if (status === "loading") return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("addAMovieTitle")}</h1>
        <p className="text-zinc-400 text-sm mt-1">{t("addMovieDesc")}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-white/10 p-1 mb-6 bg-white/[0.02]">
        <button
          onClick={() => { setMode("search"); setSelected(null); setResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${mode === "search" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
        >
          <Search className="h-4 w-4" />
          {t("searchTab")}
        </button>
        <button
          onClick={() => { setMode("url"); setSelected(null); setResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${mode === "url" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
        >
          <LinkIcon className="h-4 w-4" />
          {t("pasteLink")}
        </button>
      </div>

      {/* Search/URL input */}
      {!selected && (
        <div className="mb-6">
          {mode === "search" ? (
            <div className="relative">
              <Input
                placeholder={t("searchForMovie")}
                value={query}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="pr-10"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50 overflow-hidden">
                  {results.map((movie) => (
                    <button
                      key={movie.tmdbId}
                      onClick={() => handleSelect(movie)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="relative h-14 w-10 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                        {movie.posterUrl ? (
                          <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                        ) : (
                          <span className="text-lg flex items-center justify-center h-full">🎬</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                        <p className="text-xs text-zinc-500">{formatYear(movie.releaseDate)}</p>
                      </div>
                      {movie.rating > 0 && (
                        <span className="text-xs text-yellow-400 flex items-center gap-1 flex-shrink-0">
                          <Star className="h-3 w-3 fill-yellow-400" />
                          {formatRating(movie.rating)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder={t("pasteImdbLink")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUrlSearch} loading={searching}>
                {t("fetch")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Selected movie preview */}
      {selected && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {selected.backdropUrl && !editing && (
            <div className="relative h-32 overflow-hidden">
              <Image src={selected.backdropUrl} alt="" fill className="object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
            </div>
          )}

          <div className="p-5">
            <div className="flex gap-4">
              <div className="relative h-28 w-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                {selected.posterUrl && (
                  <Image src={selected.posterUrl} alt={selected.title} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <Input
                    value={editData.title || ""}
                    onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                    className="mb-2 font-semibold"
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-white leading-snug mb-1">{selected.title}</h2>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-zinc-400">{formatYear(selected.releaseDate)}</span>
                  {selected.rating > 0 && (
                    <span className="flex items-center gap-1 text-sm text-yellow-400">
                      <Star className="h-3 w-3 fill-yellow-400" />
                      {formatRating(selected.rating)}
                    </span>
                  )}
                  {selected.runtime && (
                    <span className="text-sm text-zinc-500">{formatRuntime(selected.runtime)}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(editing ? editData.genres || [] : selected.genres || []).slice(0, 3).map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {editing ? (
              <Textarea
                className="mt-4"
                value={editData.overview || ""}
                onChange={(e) => setEditData((d) => ({ ...d, overview: e.target.value }))}
                rows={4}
                placeholder="..."
              />
            ) : (
              selected.overview && (
                <p className="text-sm text-zinc-400 mt-3 line-clamp-3">{selected.overview}</p>
              )
            )}

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                {t("changeMovie")}
              </button>
              <span className="text-zinc-700">·</span>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                <Edit2 className="h-3 w-3" />
                {editing ? t("doneEditing") : t("editDetails")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to list form */}
      {selected && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t("addToListLabel")}</label>
            <div className="relative">
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id} className="bg-zinc-900">
                    {l.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <Textarea
            label={t("yourNote")}
            placeholder={t("whyRecommend")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">
              {t("cancel")}
            </Button>
            <Button onClick={handleAdd} loading={adding} disabled={!selectedListId} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              {t("addToListBtn")}
            </Button>
          </div>
        </div>
      )}

      {!selected && results.length === 0 && !searching && (
        <div className="text-center py-12 text-zinc-600">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">{t("searchOrPaste")}</p>
          <p className="text-xs mt-1 text-zinc-700">{t("supportsLinks")}</p>
        </div>
      )}
    </div>
  );
}

export default function AddMoviePage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-white/5 rounded w-48" /><div className="h-10 bg-white/5 rounded" /></div></div>}>
      <AddMovieContent />
    </Suspense>
  );
}
