"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimationFrame } from "framer-motion";
import { Film, ArrowRight, Star, List, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Floating particles ──────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 12,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-red-400"
          style={{ left: `${p.x}%`, bottom: "-10px", width: p.size, height: p.size }}
          animate={{ y: [0, -window.innerHeight - 40], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ── Animated word reveal ────────────────────────────────────────────────────
function AnimatedTitle() {
  const line1 = ["Делитесь", "любимыми", "фильмами"];
  const line2 = ["с", "друзьями"];

  return (
    <h1 className="text-5xl sm:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
      <span className="block text-white">
        {line1.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            initial={{ opacity: 0, y: 40, rotateX: -40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom" }}
          >
            {word}
          </motion.span>
        ))}
      </span>
      <span className="block">
        {line2.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.2em] bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

// ── Infinite marquee row ────────────────────────────────────────────────────
interface PosterMovie { id: number; title: string; posterUrl: string | null }

const PLACEHOLDER_COLORS = [
  "from-red-900 to-zinc-900",
  "from-zinc-800 to-zinc-950",
  "from-red-950 to-zinc-900",
  "from-zinc-900 to-red-950",
  "from-stone-800 to-zinc-900",
  "from-neutral-800 to-zinc-950",
];

function PosterCard({ movie, index }: { movie: PosterMovie; index: number }) {
  return (
    <div className={`relative flex-shrink-0 w-28 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]}`}>
      {movie.posterUrl ? (
        <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="128px" />
      ) : (
        <div className="flex items-center justify-center h-full opacity-20">
          <Film className="h-8 w-8 text-white" />
        </div>
      )}
    </div>
  );
}

function MarqueeRow({ movies, direction = "left", speed = 35 }: { movies: PosterMovie[]; direction?: "left" | "right"; speed?: number }) {
  // Ensure at least 10 items by repeating
  const items = Array.from({ length: Math.ceil(20 / movies.length) + 1 }, () => movies).flat();

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 w-max"
        style={{ animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite` }}
      >
        {[...items, ...items].map((movie, i) => (
          <PosterCard key={`${movie.id}-${i}`} movie={movie} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Pulsing film strip decoration ───────────────────────────────────────────
function FilmStrip() {
  return (
    <motion.div
      className="absolute top-20 right-10 hidden lg:flex flex-col gap-1 opacity-20"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-8 h-6 border border-white/30 rounded-sm flex items-center justify-center">
          <div className="w-4 h-3 bg-white/20 rounded-xs" />
        </div>
      ))}
    </motion.div>
  );
}

// ── Stats row ───────────────────────────────────────────────────────────────
function StatBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-400 backdrop-blur-sm"
      whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
      transition={{ duration: 0.15 }}
    >
      <Icon className="h-3.5 w-3.5 text-red-400" />
      {label}
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function LandingHero({ movies }: { movies: PosterMovie[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fallback cards when no movies from TMDB
  const displayMovies = movies.length >= 6 ? movies : [
    ...movies,
    ...Array.from({ length: Math.max(0, 12 - movies.length) }, (_, i) => ({
      id: -i - 1, title: "", posterUrl: null,
    })),
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black flex flex-col">

      {/* ── Aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            background: "radial-gradient(circle, rgba(220,38,38,0.25) 0%, rgba(153,27,27,0.1) 40%, transparent 70%)",
            top: "-10%", left: "10%",
            filter: "blur(60px)",
            animation: "aurora 16s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.08) 50%, transparent 70%)",
            top: "20%", right: "-5%",
            filter: "blur(80px)",
            animation: "aurora2 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
            bottom: "5%", left: "40%",
            filter: "blur(100px)",
            animation: "aurora 26s ease-in-out infinite reverse",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Particles ── */}
      {mounted && <Particles />}

      {/* ── Film strip deco ── */}
      <FilmStrip />

      {/* ── Hero text ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-1.5 backdrop-blur-sm"
            animate={{ boxShadow: ["0 0 0px rgba(220,38,38,0)", "0 0 20px rgba(220,38,38,0.3)", "0 0 0px rgba(220,38,38,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Film className="h-3.5 w-3.5 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Рекомендации фильмов — просто</span>
          </motion.div>
        </motion.div>

        <AnimatedTitle />

        <motion.p
          className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Создавайте подборки, следите за друзьями<br className="hidden sm:block" /> и никогда не забывайте рекомендации.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/register">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-7"
                style={{ boxShadow: "0 0 30px rgba(220,38,38,0.4), 0 0 60px rgba(220,38,38,0.15)" }}
              >
                Начать бесплатно
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/login">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-7">
                Войти
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <StatBadge icon={Film}   label="Любой сайт — IMDb, Multiplex, Megogo" />
          <StatBadge icon={Users}  label="Подписки на друзей" />
          <StatBadge icon={Star}   label="Лента рекомендаций" />
        </motion.div>
      </div>

      {/* ── Poster marquee ── */}
      <motion.div
        className="relative z-10 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)" }}
      >
        <div
          className="flex flex-col gap-3"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
        >
          <MarqueeRow movies={displayMovies} direction="left"  speed={40} />
          <MarqueeRow movies={[...displayMovies].reverse()} direction="right" speed={33} />
        </div>
      </motion.div>

      {/* ── Features ── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: List,   title: "Организация",  desc: "Списки «Хочу посмотреть», «Любимые», «Советую друзьям»" },
            { icon: Film,   title: "Любой сайт",   desc: "Вставьте ссылку — постер и описание подтянутся автоматически" },
            { icon: Share2, title: "Поделиться",   desc: "Публичная ссылка на список — друзья увидят все ваши рекомендации" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <div className="h-9 w-9 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
