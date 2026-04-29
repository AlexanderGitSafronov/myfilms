import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTrendingMovies, getPosterUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Film, ArrowRight, Rss, List, Users } from "lucide-react";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { LandingHero } from "@/components/home/landing-hero";
import { getServerLocale, tServer } from "@/lib/i18n-server";

async function getTrendingPosters() {
  try {
    const data = await getTrendingMovies();
    return data.results.slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title,
      posterUrl: getPosterUrl(m.poster_path, "w300"),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const session = await auth();
  const movies = await getTrendingPosters();
  const locale = await getServerLocale();
  const t = (k: Parameters<typeof tServer>[1]) => tServer(locale, k);

  if (session) {
    const lists = await prisma.movieList.findMany({
      where: { userId: session.user.id },
      include: {
        _count: { select: { movies: true } },
        movies: {
          take: 1,
          orderBy: { order: "asc" },
          include: { movie: { select: { posterUrl: true, title: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FadeUp>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              {t("welcomeBack")} {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-zinc-400 mt-1">{t("movieCollectionOverview")}</p>
          </div>
        </FadeUp>

        {/* Quick actions */}
        <FadeUp delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { href: "/add-movie", icon: Film,  label: t("addMovie"),  color: "from-red-600/80 to-red-900/80", border: "border-red-600/20" },
              { href: "/feed",      icon: Rss,   label: t("feed"),      color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
              { href: "/lists",     icon: List,  label: t("myLists"),   color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
              { href: "/profile",   icon: Users, label: t("profile"),   color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
            ].map(({ href, icon: Icon, label, color, border }) => (
              <Link
                key={href}
                href={href}
                className={`bg-gradient-to-br ${color} rounded-2xl p-4 sm:p-5 flex items-center gap-3 border ${border} hover:brightness-110 active:scale-95 transition-all duration-150`}
              >
                <Icon className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span className="font-medium text-white text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </FadeUp>

        {/* Recent lists */}
        <FadeUp delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t("yourLists")}</h2>
            <Link href="/lists" className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </FadeUp>

        {lists.length === 0 ? (
          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
              <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">{t("noListsYet")}</p>
              <p className="text-sm text-zinc-600 mt-1">{t("startByAdding")}</p>
              <Link href="/add-movie">
                <Button className="mt-4">{t("addFirstMovie")}</Button>
              </Link>
            </div>
          </FadeUp>
        ) : (
          <StaggerList className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lists.map((list) => (
              <StaggerItem key={list.id}>
                <Link
                  href={`/lists/${list.id}`}
                  className="group rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 p-4 transition-all block"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-3 relative">
                    {list.movies[0]?.movie.posterUrl ? (
                      <Image
                        src={list.movies[0].movie.posterUrl}
                        alt={list.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                    )}
                  </div>
                  <p className="font-medium text-white text-sm truncate group-hover:text-red-400 transition-colors">{list.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{list._count.movies} {t("films")}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    );
  }

  // Landing page
  return <LandingHero movies={movies} />;
}
