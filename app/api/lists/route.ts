import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const createListSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lists = await prisma.movieList.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { movies: true } },
      movies: {
        take: 3,
        orderBy: { order: "asc" },
        include: { movie: { select: { posterUrl: true, title: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ lists });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createListSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 0;

  // Ensure unique slug per user
  while (true) {
    const existing = await prisma.movieList.findUnique({
      where: { userId_slug: { userId: session.user.id, slug } },
    });
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  const list = await prisma.movieList.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      isPublic: parsed.data.isPublic,
      slug,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ list }, { status: 201 });
}
