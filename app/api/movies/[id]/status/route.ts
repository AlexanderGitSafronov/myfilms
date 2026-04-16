import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["WANT", "WATCHING", "WATCHED"]).nullable(),
  userRating: z.number().min(1).max(10).nullable().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ status: null, userRating: null });

  const { id } = await params;
  const record = await prisma.userMovieStatus.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId: id } },
  });

  return NextResponse.json({ status: record?.status ?? null, userRating: record?.userRating ?? null });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { status, userRating } = parsed.data;

  if (status === null) {
    await prisma.userMovieStatus.deleteMany({
      where: { userId: session.user.id, movieId: id },
    });
    return NextResponse.json({ status: null, userRating: null });
  }

  const record = await prisma.userMovieStatus.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId: id } },
    update: { status, ...(userRating !== undefined ? { userRating } : {}) },
    create: { userId: session.user.id, movieId: id, status, userRating: userRating ?? null },
  });

  return NextResponse.json({ status: record.status, userRating: record.userRating });
}
