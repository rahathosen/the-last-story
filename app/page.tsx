"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { LoveButton } from "@/components/ui/love-button";
import Link from "next/link";

interface Story {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  socialMedia?: {
    platform: string;
    url: string;
  };
  content: string;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function TheLastStory() {
  const [stories, setStories] = useState<Story[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [zenModeStoryId, setZenModeStoryId] = useState<string | null>(null);
  const [zenModeStory, setZenModeStory] = useState<Story | null>(null);
  const [isRandomized, setIsRandomized] = useState(false);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [randomPage, setRandomPage] = useState(1);
  const STORIES_PER_PAGE = 5;

  const homeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchStories(1);
  }, []);

  // Store state in sessionStorage for back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const state = {
        stories,
        pagination,
        zenModeStoryId,
        zenModeStory,
        isRandomized,
        allStories,
        randomPage,
      };
      sessionStorage.setItem("homePageState", JSON.stringify(state));
    }
  }, [
    stories,
    pagination,
    zenModeStoryId,
    zenModeStory,
    isRandomized,
    allStories,
    randomPage,
  ]);

  // Restore state on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = sessionStorage.getItem("homePageState");
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          if (state.stories && state.stories.length > 0) {
            setStories(state.stories);
            setPagination(state.pagination);
            setZenModeStoryId(state.zenModeStoryId);
            setZenModeStory(state.zenModeStory);
            if (state.isRandomized) {
              setIsRandomized(state.isRandomized);
              setAllStories(state.allStories || []);
              setRandomPage(state.randomPage || 1);
            }
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error restoring state:", error);
        }
      }
    }
  }, []);

  const fetchStories = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stories?page=${page}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = async () => {
    if (isRandomized) {
      setIsRandomized(false);
      setAllStories([]);
      setRandomPage(1);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/stories?page=1&limit=9999`);
      if (response.ok) {
        const data = await response.json();
        const shuffled = [...data.stories];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setAllStories(shuffled);
        setRandomPage(1);
        setIsRandomized(true);
      }
    } catch (error) {
      console.error("Error fetching all stories for randomize:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (isRandomized) {
      setRandomPage(page);
    } else {
      fetchStories(page);
    }
    scrollToSection(homeRef);
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook:
        "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
      linkedin:
        "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      twitter:
        "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      instagram:
        "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    };
    return icons[platform] || "";
  };

  const handleShare = async (story: Story) => {
    const url = `${window.location.origin}/story/${story.slug}`;
    const title = story.title || "A Story from The Last Story";
    const text = `${title} - ${story.content.substring(0, 100)}...`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleZenMode = (story: Story) => {
    if (zenModeStoryId === story.id) {
      setZenModeStoryId(null);
      setZenModeStory(null);
    } else {
      setZenModeStoryId(story.id);
      setZenModeStory(story);
    }
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    hasPrev: boolean,
    hasNext: boolean,
  ) => {
    // Build smart page list: always show first, last, and ±1 around current
    const getPageNumbers = (): (number | null)[] => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      const items: (number | null)[] = [];
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      items.push(1);
      if (left > 2) items.push(null); // left ellipsis
      for (let i = left; i <= right; i++) items.push(i);
      if (right < totalPages - 1) items.push(null); // right ellipsis
      items.push(totalPages);

      return items;
    };

    const pageNumbers = getPageNumbers();

    const btnControl =
      "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-700/60 border border-slate-700/40 transition-all duration-150 select-none disabled:opacity-30 disabled:cursor-not-allowed";
    const btnNormal =
      "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 border border-slate-700/50 transition-all duration-150 select-none";
    const btnActive =
      "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 select-none";

    return (
      <div className="flex items-center justify-center gap-1 mt-12 flex-wrap">
        {/* First page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={!hasPrev}
          title="First page"
          className={btnControl}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrev}
          title="Previous page"
          className={btnControl}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers with ellipsis */}
        {pageNumbers.map((page, idx) =>
          page === null ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 text-slate-600 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? btnActive : btnNormal}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          title="Next page"
          className={btnControl}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!hasNext}
          title="Last page"
          className={btnControl}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  // Derived display values — switches seamlessly between normal and randomized mode
  const displayedStories = isRandomized
    ? allStories.slice(
        (randomPage - 1) * STORIES_PER_PAGE,
        randomPage * STORIES_PER_PAGE,
      )
    : stories;
  const displayedTotalPages = isRandomized
    ? Math.ceil(allStories.length / STORIES_PER_PAGE)
    : pagination.totalPages;
  const displayedCurrentPage = isRandomized
    ? randomPage
    : pagination.currentPage;
  const displayedHasNext = isRandomized
    ? randomPage < displayedTotalPages
    : pagination.hasNext;
  const displayedHasPrev = isRandomized ? randomPage > 1 : pagination.hasPrev;
  const displayedTotalCount = isRandomized
    ? allStories.length
    : pagination.totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* Focus Mode Overlay */}
      {zenModeStoryId && zenModeStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md overflow-y-auto">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/60">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium tracking-widest uppercase select-none">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Focus Mode
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleShare(zenModeStory)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all duration-200"
                  title="Share this story"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={() => handleZenMode(zenModeStory)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all duration-200"
                  title="Exit Focus Mode"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="hidden sm:inline">Exit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            {/* Title */}
            {zenModeStory.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-100 mb-6 leading-snug">
                {zenModeStory.title}
              </h2>
            )}

            {/* Author meta */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/60 flex-wrap">
              <UserAvatar name={zenModeStory.name} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-300 leading-tight">
                  {zenModeStory.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {zenModeStory.socialMedia && (
                    <>
                      <a
                        href={zenModeStory.socialMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors text-xs capitalize"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d={getSocialIcon(zenModeStory.socialMedia.platform)}
                          />
                        </svg>
                        {zenModeStory.socialMedia.platform}
                      </a>
                      <span className="text-slate-700 text-xs">•</span>
                    </>
                  )}
                  <time className="text-xs text-slate-500 tabular-nums">
                    {formatDate(zenModeStory.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            {/* Story body */}
            <p
              className="text-slate-300 text-base sm:text-lg leading-[1.9] sm:leading-[2.05] whitespace-pre-wrap"
              style={{
                fontFamily: "SolaimanLipi, Kalpurush, Arial, sans-serif",
              }}
            >
              {zenModeStory.content}
            </p>

            {/* Bottom actions */}
            <div className="mt-10 pt-6 border-t border-slate-800/60 flex items-center justify-between gap-3 flex-wrap">
              <LoveButton slug={zenModeStory.slug} />
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/story/${zenModeStory.slug}`}>
                  <button className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all duration-200">
                    View Full Page
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </Link>
                <button
                  onClick={() => handleZenMode(zenModeStory)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-200"
                >
                  Exit Focus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between max-w-5xl">
          <h1 className="text-base md:text-lg font-serif text-slate-200 select-none">
            The Last Story
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollToSection(homeRef)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
            <Link href="/share">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 hover:text-indigo-200 border border-indigo-500/30 transition-all">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="hidden sm:inline">Write Your Story</span>
                <span className="sm:hidden">Write</span>
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-18 md:pb-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-7 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Honoring those who have passed
          </div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-100 mb-5 leading-tight">
            The Last Story
          </h2>

          {/* Quote */}
          <div className="mb-7">
            <p className="text-lg md:text-xl text-slate-300 font-light italic leading-relaxed mb-1.5">
              &ldquo;Every soul will taste death&rdquo;
            </p>
            <p className="text-xs text-slate-500">— Surah Al-Anbya, 35</p>
          </div>

          {/* Tagline */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-9 max-w-lg mx-auto">
            A quiet space to share the last words, final memories, and stories
            of love from those who have passed. Every story is a light kept
            burning.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/share">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-900/40 hover:shadow-indigo-800/50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Write Your Story
              </button>
            </Link>
            <button
              onClick={() => scrollToSection(homeRef)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm text-slate-300 hover:text-slate-100 border border-slate-700/60 hover:border-slate-600/70 hover:bg-slate-800/60 transition-all duration-200"
            >
              Browse Stories
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mx-auto mt-12" />
        </div>
      </section>

      {/* Stories Section */}
      <section ref={homeRef} className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-100 mb-1">
                Stories of Love and Memory
              </h3>
              <p className="text-slate-500 text-sm">
                Real words. Real people. Real moments.
              </p>
            </div>
            <button
              onClick={handleRandomize}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRandomized
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/60"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
              </svg>
              {isRandomized ? "Reset Order" : "Randomize"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-slate-300 mx-auto"></div>
              <p className="text-slate-400 mt-4 text-sm md:text-base">
                Loading stories...
              </p>
            </div>
          ) : displayedStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-base md:text-lg mb-4">
                No stories have been shared yet.
              </p>
              <Link
                href="/share"
                className="text-slate-300 hover:text-white underline transition-colors text-sm md:text-base"
              >
                Be the first to share your story
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-5 md:space-y-6">
                {displayedStories.map((story) => (
                  <Card
                    key={story.id}
                    className="group relative bg-slate-800/40 border border-slate-700/40 backdrop-blur-sm hover:bg-slate-800/65 hover:border-slate-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/50 overflow-hidden"
                  >
                    {/* Top gradient accent line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                    <CardContent className="p-5 md:p-6">
                      {/* Meta row: author info + date */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar name={story.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-300 leading-tight truncate">
                              {story.name || "Anonymous"}
                            </p>
                            {story.socialMedia && (
                              <a
                                href={story.socialMedia.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors text-xs mt-0.5"
                              >
                                <svg
                                  className="w-3 h-3 shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d={getSocialIcon(
                                      story.socialMedia.platform,
                                    )}
                                  />
                                </svg>
                                <span className="capitalize truncate">
                                  {story.socialMedia.platform}
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                        <time className="text-xs text-slate-500 shrink-0 mt-0.5 tabular-nums">
                          {formatDate(story.createdAt)}
                        </time>
                      </div>

                      {/* Story title */}
                      {story.title && (
                        <Link href={`/story/${story.slug}`}>
                          <h4 className="text-lg md:text-xl font-serif text-slate-100 mb-3 hover:text-indigo-300 transition-colors duration-200 cursor-pointer leading-snug">
                            {story.title}
                          </h4>
                        </Link>
                      )}

                      {/* Content preview */}
                      <Link href={`/story/${story.slug}`}>
                        <p
                          className="text-slate-400 leading-relaxed text-sm md:text-base cursor-pointer hover:text-slate-300 transition-colors line-clamp-3 mb-5"
                          style={{
                            fontFamily:
                              "SolaimanLipi, Kalpurush, Arial, sans-serif",
                          }}
                        >
                          {story.content}
                        </p>
                      </Link>

                      {/* Divider */}
                      <div className="h-px bg-slate-700/50 mb-4" />

                      {/* Action bar */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Left: interactions */}
                        <div className="flex items-center gap-1">
                          <LoveButton slug={story.slug} />

                          <button
                            onClick={() => handleShare(story)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-200"
                            title="Share this story"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Share</span>
                          </button>

                          <button
                            onClick={() => handleZenMode(story)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-200"
                            title="Read in Focus Mode"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="hidden sm:inline">Focus</span>
                          </button>
                        </div>

                        {/* Right: read story */}
                        <Link href={`/story/${story.slug}`}>
                          <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Read story
                            <svg
                              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {displayedTotalPages > 1 &&
                renderPagination(
                  displayedCurrentPage,
                  displayedTotalPages,
                  displayedHasPrev,
                  displayedHasNext,
                )}

              {/* Results Info */}
              <div className="flex items-center justify-center gap-2.5 mt-6 md:mt-8 flex-wrap">
                <span className="text-slate-500 text-xs md:text-sm">
                  Showing {displayedStories.length} of {displayedTotalCount}{" "}
                  stories
                </span>
                {isRandomized && (
                  <span className="flex items-center gap-1 text-xs text-indigo-400/70">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 3 21 3 21 8" />
                      <line x1="4" y1="20" x2="21" y2="3" />
                      <polyline points="21 16 21 21 16 21" />
                      <line x1="15" y1="15" x2="21" y2="21" />
                    </svg>
                    Random order
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 border-t border-slate-800/50 mt-4">
        <div className="container mx-auto max-w-5xl">
          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mb-10">
            {/* Brand column */}
            <div className="sm:col-span-1">
              <h2 className="font-serif text-slate-200 text-base mb-2">
                The Last Story
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                A space to honor the final words and memories of those we love.
              </p>
            </div>

            {/* Navigation column */}
            <div>
              <h3 className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-3">
                Navigate
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection(homeRef)}
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <Link
                    href="/share"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    Write a Story
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h3 className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-3">
                Legal & Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-slate-500 text-xs italic text-center sm:text-left">
              &ldquo;Sometimes the most powerful stories are the ones we only
              tell once.&rdquo;
            </p>
            <p className="text-slate-700 text-xs shrink-0">
              © 2024 The Last Story
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
