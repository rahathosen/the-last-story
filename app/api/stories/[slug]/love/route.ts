import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface LoveRequest {
  viewerId: string;
  action: "love" | "unlove";
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body: LoveRequest = await request.json();
    const { viewerId, action } = body;

    // Validate inputs
    if (!viewerId || !action) {
      return NextResponse.json(
        { error: "viewerId and action are required" },
        { status: 400 }
      );
    }

    // Find the story
    const story = await prisma.story.findUnique({
      where: { slug },
    });

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    if (action === "love") {
      try {
        // Create a new love record
        await prisma.love.create({
          data: {
            storyId: story.id,
            viewerId,
          },
        });

        // Count total loves for this story
        const loveCount = await prisma.love.count({
          where: { storyId: story.id },
        });

        return NextResponse.json({
          success: true,
          message: "Love added successfully",
          loveCount,
          isLoved: true,
        });
      } catch (error: any) {
        // If unique constraint violation, viewer already loved this story
        if (error.code === "P2002") {
          return NextResponse.json(
            { error: "You have already loved this story" },
            { status: 409 }
          );
        }
        throw error;
      }
    } else if (action === "unlove") {
      // Remove the love record
      await prisma.love.deleteMany({
        where: {
          storyId: story.id,
          viewerId,
        },
      });

      // Count total loves for this story
      const loveCount = await prisma.love.count({
        where: { storyId: story.id },
      });

      return NextResponse.json({
        success: true,
        message: "Love removed successfully",
        loveCount,
        isLoved: false,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error handling love:", error);
    return NextResponse.json(
      { error: "Failed to process love action" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const viewerId = searchParams.get("viewerId");

    // Find the story
    const story = await prisma.story.findUnique({
      where: { slug },
    });

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    // Count total loves
    const loveCount = await prisma.love.count({
      where: { storyId: story.id },
    });

    // Check if current viewer has loved this story
    let isLoved = false;
    if (viewerId) {
      const love = await prisma.love.findUnique({
        where: {
          storyId_viewerId: {
            storyId: story.id,
            viewerId,
          },
        },
      });
      isLoved = !!love;
    }

    return NextResponse.json({
      loveCount,
      isLoved,
    });
  } catch (error) {
    console.error("Error fetching love data:", error);
    return NextResponse.json(
      { error: "Failed to fetch love data" },
      { status: 500 }
    );
  }
}
