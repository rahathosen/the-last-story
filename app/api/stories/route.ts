import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, socialMedia, title, content } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Story content is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = generateSlug(title, content);

    // Create the story
    const story = await prisma.story.create({
      data: {
        slug,
        name: name?.trim() || null,
        socialMedia: socialMedia || null,
        title: title?.trim() || null,
        content: content.trim(),
        isApproved: false, // Stories need approval before showing
      },
    });

    return NextResponse.json(
      {
        message: "Story submitted successfully",
        id: story.id,
        slug: story.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to submit story" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const [stories, totalCount] = await Promise.all([
      prisma.story.findMany({
        where: {
          isApproved: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          socialMedia: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.story.count({
        where: {
          isApproved: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      stories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
