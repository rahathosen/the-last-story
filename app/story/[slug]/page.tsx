"use client";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { LoveButton } from "@/components/ui/love-button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";

interface Story {
  id: string;
  slug: string;
  name?: string;
  socialMedia?: {
    platform: string;
    url: string;
  };
  title?: string;
  content: string;
  createdAt: string;
}

interface AdjacentStory {
  slug: string;
  title?: string;
  name?: string;
}

interface AdjacentStories {
  previous: AdjacentStory | null;
  next: AdjacentStory | null;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [story, setStory] = useState<Story | null>(null);
  const [adjacentStories, setAdjacentStories] = useState<AdjacentStories>({
    previous: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      fetchStory();
      fetchAdjacentStories();
    }
  }, [slug]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data);

        if (data.title) {
          document.title = `${data.title} - The Last Story`;
        }

        const metaDescription = document.querySelector(
          'meta[name="description"]',
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            data.content.substring(0, 160) + "...",
          );
        } else {
          const meta = document.createElement("meta");
          meta.name = "description";
          meta.content = data.content.substring(0, 160) + "...";
          document.head.appendChild(meta);
        }

        updateMetaTag("og:title", data.title || "A Story from The Last Story");
        updateMetaTag("og:description", data.content.substring(0, 160) + "...");
        updateMetaTag("og:url", window.location.href);
        updateMetaTag("og:type", "article");
        updateMetaTag("twitter:card", "summary_large_image");
        updateMetaTag(
          "twitter:title",
          data.title || "A Story from The Last Story",
        );
        updateMetaTag(
          "twitter:description",
          data.content.substring(0, 160) + "...",
        );
      } else if (response.status === 404) {
        setError("Story not found");
      } else {
        setError("Failed to load story");
      }
    } catch (error) {
      console.error("Error fetching story:", error);
      setError("Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjacentStories = async () => {
    try {
      const response = await fetch(`/api/stories/${slug}/adjacent`);
      if (response.ok) {
        const data = await response.json();
        setAdjacentStories(data);
      }
    } catch (error) {
      console.error("Error fetching adjacent stories:", error);
    }
  };

  const updateMetaTag = (property: string, content: string) => {
    const metaTag =
      document.querySelector(`meta[property="${property}"]`) ||
      document.querySelector(`meta[name="${property}"]`);

    if (metaTag) {
      metaTag.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      if (property.startsWith("og:") || property.startsWith("twitter:")) {
        meta.setAttribute("property", property);
      } else {
        meta.setAttribute("name", property);
      }
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
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

  const handleShare = async () => {
    const url = window.location.href;
    const title = story?.title || "A Story from The Last Story";
    const text = `${title} - ${story?.content.substring(0, 100)}...`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400" />
          <p className="text-slate-500 text-sm">Loading story…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 border border-slate-700/40 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-serif text-slate-200 mb-2">
            Story Not Found
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {error ||
              "The story you're looking for doesn't exist or hasn't been approved yet."}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <>
      <Head>
        <title>
          {story.title ? `${story.title} - The Last Story` : "The Last Story"}
        </title>
        <meta
          name="description"
          content={story.content.substring(0, 160) + "..."}
        />
        <meta
          property="og:title"
          content={story.title || "A Story from The Last Story"}
        />
        <meta
          property="og:description"
          content={story.content.substring(0, 160) + "..."}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={story.title || "A Story from The Last Story"}
        />
        <meta
          name="twitter:description"
          content={story.content.substring(0, 160) + "..."}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
            <Link
              href="/"
              className="text-base font-serif text-slate-200 hover:text-white transition-colors"
            >
              The Last Story
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline text-xs">Back</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline text-xs">Share</span>
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
                  <span className="hidden sm:inline">Write a Story</span>
                  <span className="sm:hidden">Write</span>
                </button>
              </Link>
            </div>
          </nav>
        </header>

        {/* ── Main content ── */}
        <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
          <article className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Gradient accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="p-5 sm:p-7 md:p-10 lg:p-12">
              {/* Title */}
              {story.title && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-100 mb-5 leading-snug">
                  {story.title}
                </h1>
              )}

              {/* Author meta */}
              <div className="flex items-center justify-between gap-3 mb-8 pb-6 border-b border-slate-700/50 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar name={story.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-300 leading-tight truncate">
                      {story.name || "Anonymous"}
                    </p>
                    {story.socialMedia && (
                      <a
                        href={story.socialMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors text-xs capitalize mt-0.5"
                      >
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={getSocialIcon(story.socialMedia.platform)} />
                        </svg>
                        <span className="truncate">
                          {story.socialMedia.platform}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
                <time className="text-xs text-slate-500 tabular-nums shrink-0">
                  {formatDate(story.createdAt)}
                </time>
              </div>

              {/* Story body */}
              <p
                className="text-slate-300 text-base md:text-lg leading-[1.9] md:leading-[2.05] whitespace-pre-wrap"
                style={{
                  fontFamily: "SolaimanLipi, Kalpurush, Arial, sans-serif",
                }}
              >
                {story.content}
              </p>

              {/* Adjacent story navigation */}
              {(adjacentStories.previous || adjacentStories.next) && (
                <div className="mt-10 pt-7 border-t border-slate-700/50">
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-4">
                    More Stories
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {adjacentStories.previous ? (
                      <Link
                        href={`/story/${adjacentStories.previous.slug}`}
                        className="group"
                      >
                        <div className="h-full p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-200">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
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
                            Previous
                          </div>
                          <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors leading-snug line-clamp-2">
                            {adjacentStories.previous.title ||
                              `Story by ${adjacentStories.previous.name || "Anonymous"}`}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div />
                    )}
                    {adjacentStories.next ? (
                      <Link
                        href={`/story/${adjacentStories.next.slug}`}
                        className="group"
                      >
                        <div className="h-full p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-200 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs mb-2">
                            Next
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
                          </div>
                          <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors leading-snug line-clamp-2">
                            {adjacentStories.next.title ||
                              `Story by ${adjacentStories.next.name || "Anonymous"}`}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              )}

              {/* Bottom action bar */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <LoveButton slug={slug} />
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all"
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
                  </div>
                  <p className="text-xs text-slate-600 italic hidden md:block">
                    Are you prepared for a beautiful death?
                  </p>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all"
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
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </article>
        </main>

        {/* ── Footer ── */}
        <footer className="py-10 md:py-14 px-4 border-t border-slate-800/50 mt-4">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-slate-500 text-sm italic mb-5 font-light">
              "Sometimes the most powerful stories are the ones we only tell
              once."
            </p>
            <div className="flex justify-center gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
