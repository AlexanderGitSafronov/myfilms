import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.number() })),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: listId } = await params;

  const list = await prisma.movieList.findFirst({
    where: { id: listId, userId: session.user.id },
  });
  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await Promise.all(
    parsed.data.items.map((item) =>
      prisma.listMovie.updateMany({
        where: { id: item.id, listId },
        data: { order: item.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
