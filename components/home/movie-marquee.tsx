"use client";

import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
}

interface MarqueeRowProps {
  movies: Movie[];
  direction?: "left" | "right";
  speed?: number;
}

function MarqueeRow({ movies, direction = "left", speed = 35 }: MarqueeRowProps) {
  // Triple the array so there's always content to fill any screen width
  const items = [...movies, ...movies, ...movies];

  return (
    <div
      className="flex gap-3 w-max"
      style={{
        animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`,
      }}
    >
      {items.map((movie, i) => (
        <div
          key={`${movie.id}-${i}`}
          className="relative flex-shrink-0 w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900"
        >
          {movie.posterUrl && (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="144px"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function MovieMarquee({ movies }: { movies: Movie[] }) {
  if (!movies.length) return null;

  // Split into 3 rows with slight variation
  const row1 = movies;
  const row2 = [...movies.slice(4), ...movies.slice(0, 4)];
  const row3 = [...movies.slice(8), ...movies.slice(0, 8)];

  return (
    <div className="flex flex-col gap-3 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
      <MarqueeRow movies={row1} direction="left"  speed={40} />
      <MarqueeRow movies={row2} direction="right" speed={35} />
      <MarqueeRow movies={row3} direction="left"  speed={45} />
    </div>
  );
}
