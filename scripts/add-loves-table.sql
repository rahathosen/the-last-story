-- Create loves table for tracking story loves
CREATE TABLE IF NOT EXISTS loves (
  id TEXT PRIMARY KEY,
  "storyId" TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  "viewerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("storyId", "viewerId")
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loves_story_id ON loves("storyId");
CREATE INDEX IF NOT EXISTS idx_loves_viewer_id ON loves("viewerId");
