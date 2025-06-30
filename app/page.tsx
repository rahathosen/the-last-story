"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Story {
  id: string
  title?: string
  name?: string
  socialMedia?: {
    platform: string
    url: string
  }
  content: string
  createdAt: string
}

export default function TheLastStory() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [zenModeStoryId, setZenModeStoryId] = useState<string | null>(null)

  const homeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories")
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
    }
    return icons[platform] || ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* Header */}
      <header className="py-4 px-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-serif text-slate-200">The Last Story</h1>
          <div className="flex gap-4 md:gap-8">
            <button
              onClick={() => scrollToSection(homeRef)}
              className="text-slate-300 hover:text-white transition-colors duration-300 relative group flex items-center gap-2"
            >
              <span className="hidden md:inline">Home</span>
              <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="text-slate-300 hover:text-white transition-colors duration-300 relative group flex items-center gap-2"
            >
              <span className="hidden md:inline">Write Your Story</span>
              <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section
        className={`pt-8 pb-16 px-4 transition-opacity duration-1000 ${zenModeStoryId ? "opacity-10" : "opacity-100"}`}
      >
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-serif text-slate-200 mb-6 leading-tight">The Last Story</h2>
            <div className="text-center mb-4">
              <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed mb-2">
                "Every soul will taste death"
              </p>
              <p className="text-sm text-slate-400">Surah Al-Anbya - 35</p>
            </div>
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* Stories Section */}
      <section ref={homeRef} className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3
            className={`text-3xl font-serif text-slate-200 mb-12 text-center transition-opacity duration-1000 ${
              zenModeStoryId ? "opacity-20" : "opacity-100"
            }`}
          >
            Stories of Love and Memory
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-300 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">No stories have been shared yet.</p>
              <Link href="/share" className="text-slate-300 hover:text-white underline transition-colors">
                Be the first to share your story
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-1000 ${
                    zenModeStoryId && zenModeStoryId !== story.id
                      ? "opacity-10 scale-95 pointer-events-none"
                      : zenModeStoryId === story.id
                        ? "opacity-100 scale-105 bg-slate-800/80 border-slate-600/70 shadow-2xl"
                        : "opacity-100 scale-100"
                  }`}
                >
                  <CardContent className="p-8 relative">
                    {/* Zen Mode Button */}
                    <button
                      onClick={() => setZenModeStoryId(zenModeStoryId === story.id ? null : story.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                        zenModeStoryId === story.id
                          ? "bg-slate-600 text-slate-200 hover:bg-slate-500"
                          : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300"
                      }`}
                      title={zenModeStoryId === story.id ? "Exit Zen Mode" : "Enter Zen Mode"}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {zenModeStoryId === story.id ? (
                          // Exit icon (X)
                          <>
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </>
                        ) : (
                          // Zen/Focus icon (circle with dot)
                          <>
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                          </>
                        )}
                      </svg>
                    </button>

                    {story.title && (
                      <h4
                        className={`text-xl font-serif text-slate-200 mb-3 transition-all duration-500 ${
                          zenModeStoryId === story.id ? "text-2xl" : ""
                        }`}
                      >
                        {story.title}
                      </h4>
                    )}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                      <span>By {story.name || "Anonymous"}</span>
                      {story.socialMedia && (
                        <>
                          <span>•</span>
                          <a
                            href={story.socialMedia.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d={getSocialIcon(story.socialMedia.platform)} />
                            </svg>
                            {story.socialMedia.platform}
                          </a>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                    <p
                      className={`text-slate-300 leading-relaxed transition-all duration-500 ${
                        zenModeStoryId === story.id ? "text-xl leading-loose" : "text-lg"
                      }`}
                      style={{ fontFamily: "SolaimanLipi, Kalpurush, Arial, sans-serif" }}
                    >
                      {story.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 px-4 border-t border-slate-700/50 transition-opacity duration-1000 ${
          zenModeStoryId ? "opacity-10" : "opacity-100"
        }`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-slate-300 text-lg italic mb-6 font-light">
            "Sometimes the most powerful stories are the ones we only tell once."
          </p>
          <div className="flex justify-center gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
