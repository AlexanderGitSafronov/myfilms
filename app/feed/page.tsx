import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FeedClient } from "@/components/feed/feed-client";

export default async function FeedPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const items = await prisma.listMovie.findMany({
    where: {
      list: {
        isPublic: true,
        userId: { not: session.user.id },
      },
    },
    orderBy: { addedAt: "desc" },
    take: 20,
    include: {
      movie: {
        select: {
          id: true, title: true, posterUrl: true, rating: true,
          releaseDate: true, genres: true, runtime: true, overview: true,
        },
      },
      list: {
        select: {
          id: true, name: true, slug: true,
          user: { select: { id: true, name: true, username: true, image: true } },
        },
      },
    },
  });

  const nextCursor = items.length === 20 ? items[items.length - 1].id : null;

  return <FeedClient initialItems={items as never} initialCursor={nextCursor} />;
}
