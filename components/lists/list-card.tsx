"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Globe, Film, MoreVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { motion } from "framer-motion";

interface ListMovie {
  movie: { posterUrl: string | null; title: string };
}

interface MovieList {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPublic: boolean;
  _count: { movies: number };
  movies: ListMovie[];
  user?: { username: string };
}

interface ListCardProps {
  list: MovieList;
  username?: string;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function ListCard({ list, username, isOwner, onDelete }: ListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();
  const href = username ? `/${username}/${list.slug}` : `/lists/${list.id}`;
  const posters = (list.movies || []).map((m) => m.movie.posterUrl).filter(Boolean).slice(0, 4);

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors"
    >
      {/* Poster collage */}
      <Link href={href}>
        <div className="aspect-[16/7] bg-zinc-900 overflow-hidden relative">
          {posters.length > 0 ? (
            <div className={cn("grid h-full", posters.length === 1 ? "grid-cols-1" : posters.length === 2 ? "grid-cols-2" : "grid-cols-4")}>
              {posters.map((url, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image src={url!} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
              {posters.length > 0 && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Film className="h-10 w-10 text-zinc-700" />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="flex-1 min-w-0">
            <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors truncate">{list.name}</h3>
            {list.description && (
              <p className="text-sm text-zinc-500 mt-0.5 line-clamp-1">{list.description}</p>
            )}
          </Link>
          {isOwner && (
            <div className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-44 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-20 py-1 overflow-hidden">
                    <Link
                      href={`/lists/${list.id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Edit className="h-4 w-4" />
                      {t("editDetails")}
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => { onDelete(list.id); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("remove")}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-zinc-500">
            {list._count.movies} {t("films")}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-600">
            {list.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {list.isPublic ? t("public") : t("private")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
