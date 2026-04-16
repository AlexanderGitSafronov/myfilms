"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ExternalLink, Clock, Calendar, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { formatRating, formatRuntime, formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; username: string; image: string | null };
}

interface Movie {
  id: string;
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

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setMovie(d.movie);
        setLikeCount(d.likeCount);
        setLiked(d.userLiked);
        setLoading(false);
      });
  }, [id]);

  async function handleLike() {
    if (!session) { toast("Sign in to like movies", "info"); return; }
    const res = await fetch(`/api/movies/${id}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((c) => data.liked ? c + 1 : c - 1);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !comment.trim()) return;
    setPosting(true);

    const res = await fetch(`/api/movies/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });

    if (res.ok) {
      const data = await res.json();
      setMovie((m) => m ? { ...m, comments: [data.comment, ...m.comments] } : m);
      setComment("");
      toast("Comment posted!", "success");
    }
    setPosting(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-64 bg-white/5 rounded-2xl mb-6" />
        <div className="h-8 bg-white/5 rounded w-64 mb-3" />
        <div className="h-4 bg-white/5 rounded w-48" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-zinc-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => history.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
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
          {/* Poster */}
          <div className="relative h-36 w-24 sm:h-48 sm:w-32 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow-2xl">
            {movie.posterUrl ? (
              <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl">🎬</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              {movie.rating && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {formatRating(movie.rating)}
                </span>
              )}
              {movie.releaseDate && (
                <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {movie.genres.map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>

            <div className="flex items-center gap-3">
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
              {movie.sourceUrl && (
                <a
                  href={movie.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      {movie.overview && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
          <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
        </div>
      )}

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Comments ({movie.comments.length})
        </h2>

        {session && (
          <form onSubmit={handleComment} className="mb-6 flex gap-3">
            <Avatar src={session.user.image} name={session.user.name} size="sm" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Share your thoughts..."
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
          <p className="text-zinc-500 text-sm py-8 text-center">No comments yet. Be the first!</p>
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
