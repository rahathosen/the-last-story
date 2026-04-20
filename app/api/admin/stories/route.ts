import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

function checkAuth() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin-session");
  return session?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status"); // 'approved', 'pending', or null for all
    const format = searchParams.get("format"); // 'csv' or null for json

    let whereClause = {};
    if (status === "approved") {
      whereClause = { isApproved: true };
    } else if (status === "pending") {
      whereClause = { isApproved: false };
    }

    const stories = await prisma.story.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder as "asc" | "desc",
      },
    });

    // CSV export format
    if (format === "csv") {
      const csvHeaders = [
        "ID",
        "Slug",
        "Title",
        "Author Name",
        "Status",
        "Social Platform",
        "Social URL",
        "Created Date",
        "Content",
      ];

      const csvRows = stories.map((story) => [
        story.id,
        story.slug,
        story.title || "",
        story.name || "Anonymous",
        story.isApproved ? "Approved" : "Pending",
        story.socialMedia?.platform || "",
        story.socialMedia?.url || "",
        new Date(story.createdAt).toLocaleString(),
        `"${(story.content || "").replace(/"/g, '""')}"`, // Escape quotes in content
      ]);

      const csv = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="stories-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isApproved } = body;

    const story = await prisma.story.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 });
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
