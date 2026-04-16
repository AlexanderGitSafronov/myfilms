import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTrendingMovies, getPosterUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Film, ArrowRight, Users, List, Share2, Rss } from "lucide-react";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { MovieMarquee } from "@/components/home/movie-marquee";

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
              С возвращением, {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-zinc-400 mt-1">Ваша коллекция фильмов</p>
          </div>
        </FadeUp>

        {/* Quick actions */}
        <FadeUp delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { href: "/add-movie", icon: Film,  label: "Добавить фильм", color: "from-red-600/80 to-red-900/80", border: "border-red-600/20" },
              { href: "/feed",      icon: Rss,   label: "Лента",          color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
              { href: "/lists",     icon: List,  label: "Мои списки",     color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
              { href: "/profile",   icon: Users, label: "Профиль",        color: "from-zinc-800 to-zinc-900", border: "border-white/5" },
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
            <h2 className="text-lg font-semibold text-white">Ваши списки</h2>
            <Link href="/lists" className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              Смотреть все <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </FadeUp>

        {lists.length === 0 ? (
          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
              <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">Списков ещё нет</p>
              <p className="text-sm text-zinc-600 mt-1">Начните с добавления фильмов в коллекцию</p>
              <Link href="/add-movie">
                <Button className="mt-4">Добавить первый фильм</Button>
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
                  <p className="text-xs text-zinc-500 mt-0.5">{list._count.movies} фильмов</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    );
  }

  // Landing page
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* ── Aurora glow blobs (CSS animated, GPU only) ── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #dc2626 0%, #7f1d1d 50%, transparent 70%)",
            top: "5%", left: "20%",
            animation: "aurora 18s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #ef4444 0%, #dc2626 40%, transparent 70%)",
            top: "30%", right: "10%",
            animation: "aurora2 22s ease-in-out infinite",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #b91c1c 0%, transparent 70%)",
            bottom: "10%", left: "40%",
            animation: "aurora 28s ease-in-out infinite reverse",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/25 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <Film className="h-3.5 w-3.5 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Рекомендации фильмов — просто</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
            Делитесь<br />
            любимыми фильмами<br />
            <span className="gradient-text-red">с друзьями</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Создавайте подборки фильмов, следите за тем, что смотрят друзья,
            и никогда не забывайте рекомендации.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto" style={{ boxShadow: "0 0 30px rgba(220,38,38,0.35), 0 0 60px rgba(220,38,38,0.1)" }}>
                Начать бесплатно
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Войти
              </Button>
            </Link>
          </div>
        </FadeUp>
      </div>

      {/* ── Infinite scrolling poster rows ── */}
      {movies.length > 0 && (
        <div className="relative z-10 py-4" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)" }}>
          <MovieMarquee movies={movies} />
        </div>
      )}

      {/* ── Features ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <FadeUp>
          <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-10 font-medium">
            Всё что нужно для кино-коллекции
          </p>
        </FadeUp>
        <StaggerList className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: List,   title: "Организация", desc: "Создавайте списки: «Хочу посмотреть», «Любимые», «Советую друзьям»." },
            { icon: Film,   title: "Любой сайт",  desc: "Вставьте ссылку с Multiplex, Megogo, IMDB или любого другого сайта — постер и описание подтянутся сами." },
            { icon: Share2, title: "Поделиться",  desc: "Отправьте публичную ссылку на любой список. Друзья увидят всё, что вы рекомендуете." },
          ].map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 h-full hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </div>
  );
}
