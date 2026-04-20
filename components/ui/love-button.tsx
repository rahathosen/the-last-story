"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface LoveButtonProps {
  slug: string;
}

export function LoveButton({ slug }: LoveButtonProps) {
  const [isLoved, setIsLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewerId, setViewerId] = useState<string>("");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("love-viewer-id");
    if (!id) {
      id = `viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("love-viewer-id", id);
    }
    setViewerId(id);
    fetchLoveData(id);
  }, [slug]);

  const fetchLoveData = async (id: string) => {
    try {
      const response = await fetch(
        `/api/stories/${slug}/love?viewerId=${encodeURIComponent(id)}`,
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

    // Optimistic UI update
    const wasLoved = isLoved;
    setIsLoved(!wasLoved);
    setLoveCount((prev) => (wasLoved ? Math.max(0, prev - 1) : prev + 1));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    setLoading(true);
    try {
      const action = wasLoved ? "unlove" : "love";
      const response = await fetch(`/api/stories/${slug}/love`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoved(data.isLoved);
        setLoveCount(data.loveCount);
      } else if (response.status === 409) {
        setIsLoved(true);
      } else {
        // Revert on failure
        setIsLoved(wasLoved);
        setLoveCount((prev) => (wasLoved ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (error) {
      console.error("Error updating love:", error);
      // Revert on failure
      setIsLoved(wasLoved);
      setLoveCount((prev) => (wasLoved ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLoveClick}
      disabled={loading || !viewerId}
      title={isLoved ? "Unlike this story" : "Like this story"}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
        transition-all duration-200 select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isLoved
            ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-300"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
        }
      `}
    >
      <Heart
        className={`
          w-3.5 h-3.5 transition-all duration-200
          ${isLoved ? "fill-rose-400 stroke-rose-400" : "fill-none stroke-current"}
          ${animating ? "scale-125" : "scale-100"}
        `}
      />
      <span className="hidden sm:inline">{isLoved ? "Liked" : "Like"}</span>
      {loveCount > 0 && (
        <span
          className={`
            tabular-nums transition-colors duration-200
            ${isLoved ? "text-rose-400/80" : "text-slate-500"}
          `}
        >
          {loveCount}
        </span>
      )}
    </button>
  );
}
