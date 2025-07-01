import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const currentStory = await prisma.story.findUnique({
      where: {
        slug: params.slug,
        isApproved: true,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (!currentStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const [previousStory, nextStory] = await Promise.all([
      // Previous story (older)
      prisma.story.findFirst({
        where: {
          isApproved: true,
          createdAt: {
            lt: currentStory.createdAt,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          slug: true,
          title: true,
          name: true,
        },
      }),
      // Next story (newer)
      prisma.story.findFirst({
        where: {
          isApproved: true,
          createdAt: {
            gt: currentStory.createdAt,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          slug: true,
          title: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({
      previous: previousStory,
      next: nextStory,
    });
  } catch (error) {
    console.error("Error fetching adjacent stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch adjacent stories" },
      { status: 500 }
    );
  }
}
