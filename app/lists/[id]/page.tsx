"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Share2, Plus, Lock, Globe, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movies/movie-card";
import { useToast } from "@/components/ui/toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Movie {
  id: string;
  title: string;
  posterUrl?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  genres: string[];
  runtime?: number | null;
  overview?: string | null;
}

interface ListMovie {
  id: string;
  movieId: string;
  order: number;
  note?: string | null;
  movie: Movie;
}

interface MovieList {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPublic: boolean;
  userId: string;
  user: { id: string; name: string | null; username: string; image: string | null };
  movies: ListMovie[];
  _count: { movies: number };
}

function SortableMovieCard({
  listMovie,
  isOwner,
  onRemove,
}: {
  listMovie: ListMovie;
  isOwner: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: listMovie.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <MovieCard
        movie={listMovie.movie}
        listMovieId={listMovie.id}
        note={listMovie.note}
        isOwner={isOwner}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        onRemove={onRemove}
      />
    </div>
  );
}

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [list, setList] = useState<MovieList | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchList = useCallback(async () => {
    const res = await fetch(`/api/lists/${id}`);
    if (res.ok) {
      const data = await res.json();
      setList(data.list);
      setIsOwner(data.isOwner);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function handleRemove(listMovieId: string, movieId: string) {
    const res = await fetch(`/api/movies/${movieId}?listId=${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((l) => l ? { ...l, movies: l.movies.filter((m) => m.id !== listMovieId) } : l);
      toast("Movie removed", "success");
    } else {
      toast("Failed to remove movie", "error");
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !list) return;

    const items = [...list.movies];
    const oldIdx = items.findIndex((m) => m.id === active.id);
    const newIdx = items.findIndex((m) => m.id === over.id);

    const reordered = [...items];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);

    const withOrder = reordered.map((m, i) => ({ ...m, order: i }));
    setList({ ...list, movies: withOrder });

    await fetch(`/api/lists/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: withOrder.map((m) => ({ id: m.id, order: m.order })) }),
    });
  }

  async function handleShare() {
    const url = `${window.location.origin}/${list?.user.username}/${list?.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-48" />
          <div className="h-4 bg-white/5 rounded w-64" />
          <div className="space-y-3 mt-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-zinc-400">List not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/lists" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          My Lists
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">{list.name}</h1>
              <span className="flex items-center gap-1 text-xs text-zinc-600">
                {list.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              </span>
            </div>
            {list.description && <p className="text-zinc-400 text-sm">{list.description}</p>}
            <p className="text-sm text-zinc-500 mt-1">
              {list._count.movies} {list._count.movies === 1 ? "film" : "films"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <Link href="/add-movie">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Movie
                </Button>
              </Link>
            )}
            {list.isPublic && (
              <Button size="sm" variant="outline" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Share2 className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied!" : "Share"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Movies */}
      {list.movies.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-16 text-center">
          <p className="text-zinc-400 mb-4">No movies in this list yet</p>
          {isOwner && (
            <Link href="/add-movie">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add a movie
              </Button>
            </Link>
          )}
        </div>
      ) : isOwner ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list.movies.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {list.movies.map((lm) => (
                <SortableMovieCard
                  key={lm.id}
                  listMovie={lm}
                  isOwner={isOwner}
                  onRemove={() => handleRemove(lm.id, lm.movieId)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-2">
          {list.movies.map((lm) => (
            <MovieCard key={lm.id} movie={lm.movie} note={lm.note} />
          ))}
        </div>
      )}
    </div>
  );
}
