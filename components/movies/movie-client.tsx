"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ExternalLink, Clock, Calendar, Send, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n-context";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { formatRating, formatRuntime, formatDate } from "@/lib/utils";
import { WatchStatus } from "@/components/movies/watch-status";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; username: string; image: string | null };
}

interface Movie {
  id: string;
  tmdbId: number | null;
  title: string;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
  language: string | null;
  sourceUrl: string | null;
  comments: Comment[];
}

export function MovieClient({
  movie: initialMovie,
  initialLikeCount,
  initialUserLiked,
}: {
  movie: Movie;
  initialLikeCount: number;
  initialUserLiked: boolean;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { t } = useI18n();
  const [movie, setMovie] = useState(initialMovie);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialUserLiked);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Array<{ id: number; title: string; posterUrl: string | null; rating: number }>>([]);

  useEffect(() => {
    if (movie.tmdbId) {
      fetch(`/api/movies/tmdb/${movie.tmdbId}/extras`)
        .then((r) => (r.ok ? r.json() : null))
        .then((extras) => {
          if (extras?.trailer) setTrailer(extras.trailer);
          if (extras?.similar) setSimilar(extras.similar);
        });
    }
  }, [movie.tmdbId]);

  async function handleLike() {
    if (!session) { toast(t("loginToLike"), "info"); return; }
    const res = await fetch(`/api/movies/${movie.id}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((c) => (data.liked ? c + 1 : c - 1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !comment.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/movies/${movie.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    if (res.ok) {
      const data = await res.json();
      setMovie((m) => ({ ...m, comments: [data.comment, ...m.comments] }));
      setComment("");
      toast(t("commentAdded"), "success");
    }
    setPosting(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => history.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("back")}
      </button>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 mb-8">
        {movie.backdropUrl && (
          <div className="relative h-48 sm:h-72 overflow-hidden">
            <Image src={movie.backdropUrl} alt={movie.title} fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent" />
          </div>
        )}

        <div className={`flex gap-5 p-6 ${movie.backdropUrl ? "-mt-20 relative z-10" : ""}`}>
          <div className="relative h-36 w-24 sm:h-48 sm:w-32 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow-2xl">
            {movie.posterUrl ? (
              <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl">🎬</div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              {movie.rating && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Star className="h-4 w-4 fill-yellow-400" />{formatRating(movie.rating)}
                </span>
              )}
              {movie.releaseDate && (
                <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Calendar className="h-3.5 w-3.5" />{new Date(movie.releaseDate).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Clock className="h-3.5 w-3.5" />{formatRuntime(movie.runtime)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {movie.genres.map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  liked
                    ? "bg-red-600/20 text-red-400 border border-red-600/30"
                    : "bg-white/5 text-zinc-400 hover:text-red-400 border border-white/10"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-red-400" : ""}`} />
                {likeCount}
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-red-400" />
                  Трейлер
                </a>
              )}
              {movie.sourceUrl && (
                <a
                  href={movie.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />{t("source")}
                </a>
              )}
            </div>
            <div className="mt-3">
              <WatchStatus movieId={movie.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      {movie.overview && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">{t("movieOverview")}</h2>
          <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
        </div>
      )}

      {/* Similar movies (loaded client-side) */}
      {similar.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Похожие фильмы</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {similar.map((m) => (
              <a key={m.id} href={`/search?q=${encodeURIComponent(m.title)}`} className="flex-shrink-0 w-24 group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 mb-2">
                  {m.posterUrl ? (
                    <Image src={m.posterUrl} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🎬</div>
                  )}
                </div>
                <p className="text-xs text-zinc-400 group-hover:text-white transition-colors line-clamp-2 leading-snug">{m.title}</p>
                {m.rating > 0 && (
                  <p className="text-xs text-yellow-400 mt-0.5 flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-yellow-400" />{m.rating.toFixed(1)}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {t("comments")} ({movie.comments.length})
        </h2>

        {session && (
          <form onSubmit={handleComment} className="mb-6 flex gap-3">
            <Avatar src={session.user.image} name={session.user.name} size="sm" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder={t("commentPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={1}
                className="flex-1"
              />
              <Button type="submit" size="icon" loading={posting} disabled={!comment.trim()} className="self-end h-10 w-10 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {movie.comments.length === 0 ? (
          <p className="text-zinc-500 text-sm py-8 text-center">{t("noComments")}</p>
        ) : (
          <div className="space-y-4">
            {movie.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Link href={`/${c.user.username}`}>
                  <Avatar src={c.user.image} name={c.user.name} size="sm" className="flex-shrink-0" />
                </Link>
                <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/${c.user.username}`} className="text-sm font-medium text-white hover:text-red-400 transition-colors">
                      {c.user.name}
                    </Link>
                    <span className="text-xs text-zinc-600">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-300">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
