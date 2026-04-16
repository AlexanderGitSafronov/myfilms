import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { ListCard } from "@/components/lists/list-card";
import { Film, List } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return {};
  return {
    title: `@${username} on MyFilms`,
    description: user.bio || `${user.name}'s movie collection on MyFilms`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      lists: {
        where: session?.user?.id
          ? { OR: [{ isPublic: true }, { userId: session.user.id }] }
          : { isPublic: true },
        include: {
          _count: { select: { movies: true } },
          movies: {
            take: 4,
            orderBy: { order: "asc" },
            include: { movie: { select: { posterUrl: true, title: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      _count: { select: { lists: true, likes: true } },
    },
  });

  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-10">
        <Avatar src={user.image} name={user.name} size="xl" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-zinc-400 text-sm">@{user.username}</p>
          {user.bio && <p className="text-zinc-300 mt-2 max-w-md">{user.bio}</p>}

          <div className="flex items-center gap-5 mt-3">
            <div className="text-center">
              <p className="text-white font-semibold">{user._count.lists}</p>
              <p className="text-zinc-500 text-xs">Списков</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">{user._count.likes}</p>
              <p className="text-zinc-500 text-xs">Лайков</p>
            </div>
          </div>

          {isOwner && (
            <Link
              href="/profile"
              className="inline-block mt-4 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-lg transition-colors"
            >
              Редактировать профиль
            </Link>
          )}
        </div>
      </div>

      {/* Lists */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <List className="h-5 w-5 text-zinc-500" />
          <h2 className="text-lg font-semibold text-white">
            {isOwner ? "Мои списки" : `Списки ${user.name?.split(" ")[0] || username}`}
          </h2>
        </div>

        {user.lists.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-16 text-center">
            <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">Публичных списков ещё нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                username={username}
                isOwner={isOwner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
