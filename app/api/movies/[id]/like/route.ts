import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: movieId } = await params;

  const existing = await prisma.movieLike.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
  });

  if (existing) {
    await prisma.movieLike.delete({
      where: { userId_movieId: { userId: session.user.id, movieId } },
    });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.movieLike.create({
      data: { userId: session.user.id, movieId },
    });
    return NextResponse.json({ liked: true });
  }
}
