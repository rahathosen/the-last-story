import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title?: string, content?: string): string {
  // Use title if available, otherwise use first 50 characters of content
  const text = title || content?.substring(0, 50) || "story";

  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim()
      .substring(0, 50) + // Limit length
    "-" +
    Date.now().toString(36)
  ); // Add timestamp for uniqueness
}
