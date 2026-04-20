"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LoveButtonProps {
  slug: string;
}

export function LoveButton({ slug }: LoveButtonProps) {
  const [isLoved, setIsLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewerId, setViewerId] = useState<string>("");

  // Initialize viewer ID from localStorage on mount
  useEffect(() => {
    let id = localStorage.getItem("love-viewer-id");
    
    // Generate a new ID if it doesn't exist
    if (!id) {
      id = `viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("love-viewer-id", id);
    }
    
    setViewerId(id);
    
    // Fetch love data for this story
    fetchLoveData(id);
  }, [slug]);

  const fetchLoveData = async (id: string) => {
    try {
      const response = await fetch(
        `/api/stories/${slug}/love?viewerId=${encodeURIComponent(id)}`
      );
      if (response.ok) {
        const data = await response.json();
        setLoveCount(data.loveCount);
        setIsLoved(data.isLoved);
      }
    } catch (error) {
      console.error("Error fetching love data:", error);
    }
  };

  const handleLoveClick = async () => {
    if (!viewerId || loading) return;

    setLoading(true);
    try {
      const action = isLoved ? "unlove" : "love";
      const response = await fetch(`/api/stories/${slug}/love`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewerId,
          action,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoved(data.isLoved);
        setLoveCount(data.loveCount);
      } else if (response.status === 409) {
        // Already loved - update UI to reflect current state
        setIsLoved(true);
      }
    } catch (error) {
      console.error("Error updating love:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLoveClick}
      disabled={loading || !viewerId}
      variant="outline"
      className={`border-slate-600 bg-transparent text-sm transition-all duration-200 ${
        isLoved
          ? "text-red-500 border-red-500/50 hover:border-red-500 hover:bg-red-500/5"
          : "text-slate-300 hover:bg-slate-700"
      }`}
    >
      <Heart
        className={`w-4 h-4 ${isLoved ? "fill-current" : ""}`}
      />
      {loveCount > 0 && <span>({loveCount})</span>}
    </Button>
  );
}
