import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ListsClient } from "@/components/lists/lists-client";

export default async function ListsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const lists = await prisma.movieList.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { movies: true } },
      movies: {
        take: 4,
        orderBy: { order: "asc" },
        include: { movie: { select: { posterUrl: true, title: true } } },
      },
    },
  });

  return <ListsClient initialLists={lists as never} username={session.user.username ?? ""} />;
}
