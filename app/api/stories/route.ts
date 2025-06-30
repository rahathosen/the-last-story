import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, socialMedia, title, content } = body

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Story content is required" }, { status: 400 })
    }

    // Create the story
    const story = await prisma.story.create({
      data: {
        name: name?.trim() || null,
        socialMedia: socialMedia || null,
        title: title?.trim() || null,
        content: content.trim(),
        isApproved: false, // Stories need approval before showing
      },
    })

    return NextResponse.json(
      {
        message: "Story submitted successfully",
        id: story.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: {
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        socialMedia: true,
        title: true,
        content: true,
        createdAt: true,
      },
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error("Error fetching stories:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}
