"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, GripVertical, Trash2, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatYear, formatRating, formatRuntime } from "@/lib/utils";

interface Movie {
  id: string;
  title: string;
  posterUrl?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  genres?: string[];
  runtime?: number | null;
  overview?: string | null;
}

interface MovieCardProps {
  movie: Movie;
  listMovieId?: string;
  note?: string | null;
  isOwner?: boolean;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
  onRemove?: () => void;
  compact?: boolean;
}

export function MovieCard({
  movie,
  listMovieId,
  note,
  isOwner,
  dragHandleProps,
  isDragging,
  onRemove,
  compact,
}: MovieCardProps) {
  if (compact) {
    return (
      <Link href={`/movies/${movie.id}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
        <div className="relative h-16 w-11 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <span className="text-lg">🎬</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">{movie.title}</p>
          <p className="text-xs text-zinc-500">{formatYear(movie.releaseDate)}</p>
        </div>
        {movie.rating && (
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Star className="h-3 w-3 fill-yellow-400" />
            {formatRating(movie.rating)}
          </div>
        )}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all",
        isDragging && "shadow-2xl shadow-black/50 scale-[1.02] z-50 border-red-500/30"
      )}
    >
      {/* Drag handle */}
      {isOwner && dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {/* Poster */}
      <Link href={`/movies/${movie.id}`} className="flex-shrink-0">
        <div className="relative h-28 w-20 sm:h-36 sm:w-24 rounded-lg overflow-hidden bg-zinc-800 hover:scale-105 transition-transform">
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link href={`/movies/${movie.id}`}>
            <h3 className="font-semibold text-white hover:text-red-400 transition-colors line-clamp-2 leading-snug">
              {movie.title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-sm text-zinc-500">{formatYear(movie.releaseDate)}</span>
            {movie.rating && (
              <span className="flex items-center gap-1 text-sm text-yellow-400">
                <Star className="h-3 w-3 fill-yellow-400" />
                {formatRating(movie.rating)}
              </span>
            )}
            {movie.runtime && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="h-3 w-3" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres.slice(0, 3).map((g) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>
          )}
          {movie.overview && (
            <p className="text-xs text-zinc-500 mt-2 line-clamp-2 hidden sm:block">{movie.overview}</p>
          )}
          {note && (
            <p className="text-xs text-zinc-400 mt-2 italic border-l-2 border-red-600/50 pl-2">"{note}"</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {isOwner && onRemove && (
        <div className="flex-shrink-0 flex flex-col items-end justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Link href={`/movies/${movie.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Poster grid card for list previews
export function MoviePosterCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
      {movie.posterUrl ? (
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <p className="text-xs text-white font-medium line-clamp-2">{movie.title}</p>
      </div>
    </Link>
  );
}
