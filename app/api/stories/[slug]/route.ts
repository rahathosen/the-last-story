import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: {
        slug: params.slug,
        isApproved: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        socialMedia: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}
