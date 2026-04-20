"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
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
      };
      sessionStorage.setItem("homePageState", JSON.stringify(state));
    }
  }, [stories, pagination, zenModeStoryId, zenModeStory]);

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

  const handlePageChange = (page: number) => {
    fetchStories(page);
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === pagination.currentPage ? "default" : "outline"}
          className={`w-9 h-9 md:w-11 md:h-11 p-0 text-sm font-medium ${
            i === pagination.currentPage
              ? "bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:bg-secondary bg-transparent"
          }`}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 md:gap-3 mt-14 md:mt-16">
        <Button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
          variant="outline"
          className="w-9 h-9 md:w-11 md:h-11 p-0 border-border text-muted-foreground hover:bg-secondary bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
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
        </Button>
        {pages}
        <Button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          variant="outline"
          className="w-9 h-9 md:w-11 md:h-11 p-0 border-border text-muted-foreground hover:bg-secondary bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
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
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Zen Mode Overlay - Improved for mobile scrolling */}
      {zenModeStoryId && zenModeStory && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-2 md:p-4 py-4 md:py-8">
            <div className="w-full max-w-4xl">
              <Card className="bg-card border-border/50 backdrop-blur-sm">
                <CardContent className="p-4 md:p-8 lg:p-12 relative">
                  <button
                    onClick={() => handleZenMode(zenModeStory)}
                    className="sticky top-0 float-right mb-4 p-2 rounded-full bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300 z-10"
                    title="Exit Zen Mode"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <div className="clear-both">
                    {zenModeStory.title && (
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-6 md:mb-8 leading-tight text-balance">
                        {zenModeStory.title}
                      </h2>
                    )}

                    <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-2 md:gap-3">
                        <UserAvatar name={zenModeStory.name} size="md" />
                        <span className="text-sm md:text-base text-foreground font-medium">
                          By {zenModeStory.name || "Anonymous"}
                        </span>
                      </div>
                      {zenModeStory.socialMedia && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <a
                            href={zenModeStory.socialMedia.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors text-sm md:text-base"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d={getSocialIcon(
                                  zenModeStory.socialMedia.platform
                                )}
                              />
                            </svg>
                            <span className="hidden sm:inline">
                              {zenModeStory.socialMedia.platform}
                            </span>
                          </a>
                        </>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span className="text-sm md:text-base text-muted-foreground">
                        {formatDate(zenModeStory.createdAt)}
                      </span>
                    </div>

                    <div className="prose prose-lg max-w-none my-8 md:my-12">
                      <p
                        className="text-foreground leading-8 md:leading-9 text-base md:text-lg lg:text-lg whitespace-pre-wrap"
                        style={{
                          fontFamily:
                            "SolaimanLipi, Kalpurush, Arial, sans-serif",
                        }}
                      >
                        {zenModeStory.content}
                      </p>
                    </div>

                    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border flex justify-center">
                      <Button
                        onClick={() => handleShare(zenModeStory)}
                        variant="outline"
                        className="border-border text-foreground hover:bg-secondary bg-transparent text-sm md:text-base"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        Share This Story
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="py-3 md:py-4 border-b border-border/30">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-lg md:text-xl font-serif text-foreground font-medium">
            The Last Story
          </h1>
          <div className="flex gap-4 md:gap-4 lg:gap-8">
            <button
              onClick={() => scrollToSection(homeRef)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group flex items-center gap-1 md:gap-2"
            >
              <span className="hidden md:inline">Home</span>
              <svg
                className="w-4 h-4 md:hidden inline"
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
              <span className="absolute bottom-0 left-0 w-0 h-px bg-slate-300 group-hover:w-full transition-all duration-300"></span>
            </button>
            <Link
              href="/share"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group flex items-center gap-1 md:gap-2"
            >
              <span className="hidden md:inline">Write Your Story</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 md:hidden inline"
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
              <span className="absolute bottom-0 left-0 w-0 h-px bg-slate-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 md:mb-8 leading-tight text-balance font-semibold">
              The Last Story
            </h2>
            <div className="text-center mb-6">
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light italic leading-relaxed mb-3">
                "Every soul will taste death"
              </p>
              <p className="text-xs md:text-sm text-muted-foreground/70">
                Surah Al-Anbya - 35
              </p>
            </div>
          </div>
          <div className="w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* Stories Section */}
      <section ref={homeRef} className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-12 md:mb-16 text-center text-balance font-semibold">
            Stories of Love and Memory
          </h3>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 md:h-14 md:w-14 border-2 border-muted-foreground/20 border-t-foreground mx-auto"></div>
              <p className="text-muted-foreground mt-6 text-sm md:text-base font-medium">
                Loading stories...
              </p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-base md:text-lg mb-6">
                No stories have been shared yet.
              </p>
              <Link
                href="/share"
                className="text-accent hover:text-accent underline transition-colors text-sm md:text-base font-medium"
              >
                Be the first to share your story
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6 md:space-y-8">
                {stories.map((story) => (
                  <Card
                    key={story.id}
                    className="bg-card border-border/50 backdrop-blur-sm hover:border-border hover:bg-card/80 transition-all duration-300 shadow-sm"
                  >
                    <CardContent className="p-5 md:p-7 relative">
                      {/* Action Buttons */}
                      <div className="absolute top-4 md:top-5 right-4 md:right-5 flex gap-2 md:gap-3">
                        <button
                          onClick={() => handleShare(story)}
                          className="p-2 md:p-2.5 rounded-full bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                          title="Share this story"
                        >
                          <svg
                            width="14"
                            height="14"
                            className="md:w-4 md:h-4"
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
                        </button>
                        <button
                          onClick={() => handleZenMode(story)}
                          className="p-2 md:p-2.5 rounded-full bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                          title="Enter Zen Mode"
                        >
                          <svg
                            width="14"
                            height="14"
                            className="md:w-4 md:h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>

                      {story.title && (
                        <Link href={`/story/${story.slug}`}>
                          <h4 className="text-lg md:text-xl lg:text-2xl font-serif text-foreground mb-4 hover:text-accent transition-colors cursor-pointer pr-16 md:pr-20 font-semibold text-balance">
                            {story.title}
                          </h4>
                        </Link>
                      )}

                      <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6 text-xs md:text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <UserAvatar name={story.name} size="sm" />
                          <span>By {story.name || "Anonymous"}</span>
                        </div>
                        {story.socialMedia && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <a
                              href={story.socialMedia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d={getSocialIcon(story.socialMedia.platform)}
                                />
                              </svg>
                              <span className="hidden sm:inline">
                                {story.socialMedia.platform}
                              </span>
                            </a>
                          </>
                        )}
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(story.createdAt)}</span>
                      </div>

                      <Link href={`/story/${story.slug}`}>
                        <p
                          className="text-foreground leading-8 text-sm md:text-base cursor-pointer hover:text-muted-foreground transition-colors line-clamp-4"
                          style={{
                            fontFamily:
                              "SolaimanLipi, Kalpurush, Arial, sans-serif",
                          }}
                        >
                          {story.content.length > 200
                            ? `${story.content.substring(0, 200)}...`
                            : story.content}
                        </p>
                      </Link>

                      {story.content.length > 200 && (
                        <Link href={`/story/${story.slug}`}>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-accent hover:text-accent mt-4 text-xs md:text-sm font-semibold"
                          >
                            Read full story →
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && renderPagination()}

              {/* Results Info */}
              <div className="text-center mt-8 md:mt-10 text-muted-foreground text-xs md:text-sm font-medium">
                Showing {stories.length} of {pagination.totalCount} stories
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 border-t border-border/30 mt-12 md:mt-16">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground text-base md:text-lg italic mb-6 md:mb-8 font-light leading-8">
            "Sometimes the most powerful stories are the ones we only tell
            once."
          </p>
          <div className="flex justify-center gap-6 md:gap-10 text-xs md:text-sm text-muted-foreground/70">
            <a href="#" className="hover:text-foreground transition-colors font-medium">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors font-medium">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors font-medium">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
