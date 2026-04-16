import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(200).optional(),
  image: z.string().url().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      lists: {
        include: {
          _count: { select: { movies: true } },
          movies: {
            take: 4,
            include: { movie: { select: { posterUrl: true, title: true } } },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      _count: { select: { lists: true, likes: true } },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { id: true, name: true, username: true, bio: true, image: true, email: true },
  });

  return NextResponse.json({ user });
}
