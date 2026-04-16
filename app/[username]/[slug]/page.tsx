import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { MovieCard } from "@/components/movies/movie-card";
import { ShareButton } from "@/components/lists/share-button";
import { Globe, Lock, Film, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return {};
  const list = await prisma.movieList.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
  });
  if (!list) return {};
  return {
    title: `${list.name} by @${username}`,
    description: list.description || `${username}'s movie list on MyFilms`,
  };
}

export default async function SharedListPage({ params }: PageProps) {
  const { username, slug } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) notFound();

  const list = await prisma.movieList.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
    include: {
      user: { select: { id: true, name: true, username: true, image: true, bio: true } },
      movies: {
        orderBy: { order: "asc" },
        include: { movie: true },
      },
      _count: { select: { movies: true } },
    },
  });

  if (!list) notFound();

  const isOwner = session?.user?.id === list.userId;
  if (!list.isPublic && !isOwner) notFound();

  const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3002"}/${username}/${slug}`;

  return (
    <div className="min-h-screen">
      {/* Header banner */}
      <div className="relative bg-gradient-to-b from-zinc-900 to-black border-b border-white/5">
        {/* Poster strip background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="flex gap-1 h-full">
            {list.movies.slice(0, 8).map((lm) => (
              lm.movie.posterUrl && (
                <div key={lm.id} className="relative w-24 flex-shrink-0 h-full">
                  <Image src={lm.movie.posterUrl} alt="" fill className="object-cover" />
                </div>
              )
            ))}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href={`/${username}`} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            @{username}&apos;s profile
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <Link href={`/${username}`}>
              <Avatar src={list.user.image} name={list.user.name} size="md" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/${username}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                  @{username}
                </Link>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1 text-xs text-zinc-600">
                  {list.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {list.isPublic ? "Публичный" : "Приватный"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{list.name}</h1>
              {list.description && (
                <p className="text-zinc-400 mt-1">{list.description}</p>
              )}
              <p className="text-sm text-zinc-500 mt-2">
                {list._count.movies} фильмов
              </p>
            </div>
          </div>

          {/* Share & copy */}
          <div className="flex items-center gap-3 flex-wrap">
            <ShareButton url={shareUrl} listName={list.name} />
            {isOwner && (
              <Link
                href={`/lists/${list.id}`}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Редактировать список
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Movies */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {list.movies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">Список пуст</p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.movies.map((lm, index) => (
              <div key={lm.id} className="flex gap-4 items-start">
                <span className="text-2xl font-bold text-zinc-800 w-8 text-right flex-shrink-0 pt-4">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <MovieCard movie={lm.movie} note={lm.note} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
