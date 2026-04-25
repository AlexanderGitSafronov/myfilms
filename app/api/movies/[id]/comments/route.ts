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

  let parentAuthorId: string | null = null;
  if (parsed.data.parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parsed.data.parentId, movieId },
      select: { id: true, userId: true },
    });
    if (!parent) {
      return NextResponse.json({ error: "Parent comment not found" }, { status: 400 });
    }
    parentAuthorId = parent.userId;
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
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });
  } catch {
    // Fallback when parentId column not migrated — create as root comment.
    comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        userId: session.user.id,
        movieId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });
  }

  // Notifications — best-effort, must never break the comment response.
  try {
    if (parentAuthorId && parentAuthorId !== session.user.id) {
      // Reply: notify only the parent comment author.
      await prisma.notification.create({
        data: {
          userId: parentAuthorId,
          fromUserId: session.user.id,
          type: "COMMENT",
          movieId,
        },
      });
    } else if (!parsed.data.parentId) {
      // Root comment: notify everyone who has this movie in their lists,
      // excluding the commenter and deduplicated.
      const owners = await prisma.listMovie.findMany({
        where: { movieId, list: { userId: { not: session.user.id } } },
        select: { list: { select: { userId: true } } },
      });
      const recipients = Array.from(new Set(owners.map((o) => o.list.userId)));

      if (recipients.length > 0) {
        await prisma.notification.createMany({
          data: recipients.map((userId) => ({
            userId,
            fromUserId: session.user.id,
            type: "COMMENT" as const,
            movieId,
          })),
        });
      }
    }
  } catch (err) {
    console.error("notification create failed", err);
  }

  return NextResponse.json({ comment }, { status: 201 });
}
