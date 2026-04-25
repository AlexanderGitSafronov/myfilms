import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(500),
  parentId: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: movieId } = await params;
  const body = await req.json();
  const parsed = commentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parsed.data.parentId, movieId },
      select: { id: true },
    });
    if (!parent) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 400 });
    }
  }

  let comment;
  try {
    comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        userId: session.user.id,
        movieId,
        parentId: parsed.data.parentId ?? null,
      },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });
  } catch {
    // Fallback: parentId column not yet migrated — create as root comment
    comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        userId: session.user.id,
        movieId,
      },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });
  }

  return NextResponse.json({ comment }, { status: 201 });
}
