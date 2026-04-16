import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTrendingMovies, getPosterUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Film, ArrowRight, Users, List, Share2 } from "lucide-react";

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
    // Logged-in home: show recent lists
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Your movie collection at a glance</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {[
            { href: "/add-movie", icon: Film, label: "Add a Movie", color: "from-red-600 to-red-800" },
            { href: "/lists", icon: List, label: "My Lists", color: "from-zinc-700 to-zinc-900" },
            { href: "/profile", icon: Users, label: "My Profile", color: "from-zinc-700 to-zinc-900" },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`bg-gradient-to-br ${color} rounded-2xl p-5 flex items-center gap-3 hover:scale-[1.02] transition-transform border border-white/5`}
            >
              <Icon className="h-5 w-5 text-white/80" />
              <span className="font-medium text-white">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent lists */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Lists</h2>
          <Link href="/lists" className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {lists.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
            <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No lists yet</p>
            <p className="text-sm text-zinc-600 mt-1">Start by adding some movies to your collection</p>
            <Link href="/add-movie">
              <Button className="mt-4">Add your first movie</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="group rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 transition-all"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-3 relative">
                  {list.movies[0]?.movie.posterUrl ? (
                    <Image
                      src={list.movies[0].movie.posterUrl}
                      alt={list.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                  )}
                </div>
                <p className="font-medium text-white text-sm truncate group-hover:text-red-400 transition-colors">{list.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{list._count.movies} films</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Landing page for unauthenticated users
  return (
    <div className="relative overflow-hidden">
      {/* Background poster wall */}
      <div className="absolute inset-0 -top-16 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black z-10" />
        <div className="grid grid-cols-6 gap-1 opacity-20 -rotate-3 scale-110">
          {movies.concat(movies).map((movie, i) => (
            <div key={i} className="aspect-[2/3] rounded-sm overflow-hidden">
              {movie.posterUrl && (
                <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 mb-6">
          <Film className="h-3.5 w-3.5 text-red-400" />
          <span className="text-sm text-red-400 font-medium">Movie recommendations, simplified</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Share films you love<br />
          <span className="text-red-500">with friends</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Build curated movie lists, discover what your friends are watching, and never forget a recommendation again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: List, title: "Organize", desc: "Create custom lists like Watch Later, Favorites, or Recommended for Friends." },
            { icon: Film, title: "Discover", desc: "Search movies via TMDB — auto-fetch title, poster, ratings and genres." },
            { icon: Share2, title: "Share", desc: "Send a public link to any list. Friends see exactly what you recommend." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending section */}
      {movies.length > 0 && (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-xl font-semibold text-white mb-4">Trending this week</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {movies.map((movie) => (
              <div key={movie.id} className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative group">
                {movie.posterUrl && (
                  <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
