"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type SocialPlatform = "facebook" | "linkedin" | "twitter" | "instagram";

interface SocialMedia {
  platform: SocialPlatform;
  url: string;
}

export default function ShareStoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    socialMedia: null as SocialMedia | null,
    title: "",
    story: "",
    consent: false,
  });

  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const socialPlatforms = [
    {
      value: "facebook",
      label: "Facebook",
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
      value: "twitter",
      label: "Twitter/X",
      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
  ];

  const handleSocialPlatformChange = (platform: SocialPlatform) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia:
        prev.socialMedia?.platform === platform
          ? null
          : { platform, url: prev.socialMedia?.url || "" },
    }));
  };

  const handleSocialUrlChange = (url: string) => {
    if (formData.socialMedia) {
      setFormData((prev) => ({
        ...prev,
        socialMedia: prev.socialMedia ? { ...prev.socialMedia, url } : null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.story.trim() || !formData.consent) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim() || null,
          socialMedia: formData.socialMedia,
          title: formData.title.trim() || null,
          content: formData.story.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit story");
      }

      setShowThankYou(true);

      setTimeout(() => {
        setFormData({
          name: "",
          socialMedia: null,
          title: "",
          story: "",
          consent: false,
        });
        setShowThankYou(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting story:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit story",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedPlatformIcon = () => {
    if (!formData.socialMedia) return null;
    const platform = socialPlatforms.find(
      (p) => p.value === formData.socialMedia?.platform,
    );
    return platform?.icon;
  };

  const canSubmit = formData.story.trim() && formData.consent && !isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
          <Link
            href="/"
            className="text-base font-serif text-slate-200 hover:text-white transition-colors"
          >
            The Last Story
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all">
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
            </Link>
            <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-indigo-400 bg-indigo-600/10 border border-indigo-500/20">
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
            </span>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="pt-10 md:pt-14 pb-10 md:pb-14 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-100 mb-4 leading-tight">
            Share Your Story
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Your story matters. Share a moment of love, memory, or final goodbye
            that touched your heart and may bring comfort to others.
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mx-auto mt-6" />
        </div>
      </section>

      {/* ── Form section ── */}
      <section className="pb-14 md:pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {showThankYou ? (
            /* Thank you card */
            <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="p-8 md:p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-slate-100 mb-3">
                  Thank You
                </h2>
                <p className="text-slate-400 text-base md:text-lg mb-4 leading-relaxed">
                  Your story has been submitted successfully. It will be
                  reviewed and shared to help others find comfort in shared
                  experiences of love and loss.
                </p>
                <p className="text-slate-600 text-sm italic">
                  May your loved ones rest in peace, and may their memories
                  bring you comfort.
                </p>
              </div>
            </div>
          ) : (
            /* Form card */
            <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
              {/* Gradient top accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

              <div className="p-5 sm:p-7 md:p-10">
                {/* Error banner */}
                {error && (
                  <div className="mb-6 p-4 bg-rose-900/30 border border-rose-700/40 rounded-xl flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-rose-300 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* ── Section 1: Personal Information ── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/50">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h3 className="text-base font-semibold text-slate-200">
                        Personal Information
                      </h3>
                      <span className="text-xs text-slate-600 ml-auto">
                        optional
                      </span>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-300"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Leave blank to remain anonymous"
                        className="bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-lg h-10"
                      />
                    </div>

                    {/* Social media */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Social Media Link
                        </label>
                        <p className="text-xs text-slate-500">
                          Link readers to your profile (optional)
                        </p>
                      </div>

                      <Select
                        value={formData.socialMedia?.platform || ""}
                        onValueChange={(value: SocialPlatform) =>
                          handleSocialPlatformChange(value)
                        }
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-700/60 text-slate-200 rounded-lg h-10">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 rounded-xl">
                          {socialPlatforms.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                              className="text-slate-200 focus:bg-slate-700 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d={platform.icon} />
                                </svg>
                                {platform.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {formData.socialMedia && (
                        <div className="space-y-1.5">
                          <label className="block text-xs text-slate-500">
                            Profile URL
                          </label>
                          <div className="relative">
                            {getSelectedPlatformIcon() && (
                              <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d={getSelectedPlatformIcon()!} />
                              </svg>
                            )}
                            <Input
                              value={formData.socialMedia.url}
                              onChange={(e) =>
                                handleSocialUrlChange(e.target.value)
                              }
                              placeholder={`Your ${
                                socialPlatforms.find(
                                  (p) =>
                                    p.value === formData.socialMedia?.platform,
                                )?.label
                              } profile URL`}
                              className="pl-9 bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500/50 rounded-lg h-10"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Section 2: Your Story ── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/50">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h3 className="text-base font-semibold text-slate-200">
                        Your Story
                      </h3>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-slate-300"
                      >
                        Story Title{" "}
                        <span className="text-slate-600 font-normal">
                          (optional)
                        </span>
                      </label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Give your story a meaningful title"
                        className="bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500/50 rounded-lg h-10"
                      />
                    </div>

                    {/* Story content */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="story"
                          className="block text-sm font-medium text-slate-300"
                        >
                          Your Story <span className="text-rose-500">*</span>
                        </label>
                        {formData.story.length > 0 && (
                          <span className="text-xs text-slate-600 tabular-nums">
                            {formData.story.length} chars
                          </span>
                        )}
                      </div>
                      <Textarea
                        id="story"
                        value={formData.story}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            story: e.target.value,
                          }))
                        }
                        placeholder="Share your story of love, memory, or final moments... Write in any language that feels most natural to you."
                        rows={10}
                        className="bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500/50 resize-none rounded-lg min-h-[220px] md:min-h-[300px] leading-relaxed"
                        style={{
                          fontFamily:
                            "SolaimanLipi, Kalpurush, Arial, sans-serif",
                        }}
                        required
                      />
                      <p className="text-xs text-slate-600">
                        Share the details that matter most — the words spoken,
                        the moments shared, the love expressed.
                      </p>
                    </div>
                  </div>

                  {/* ── Section 3: Agreement ── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/50">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h3 className="text-base font-semibold text-slate-200">
                        Agreement
                      </h3>
                    </div>

                    <label
                      htmlFor="consent"
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            consent: checked as boolean,
                          }))
                        }
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 shrink-0"
                        required
                      />
                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                        I agree for this story to be shared publicly and
                        understand it will help others find comfort in shared
                        experiences of love and loss. I confirm that I have the
                        right to share this story and that it respects the
                        memory and dignity of those mentioned.
                      </span>
                    </label>
                  </div>

                  {/* ── Submit button ── */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={`
                        w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                        flex items-center justify-center gap-2
                        ${
                          canSubmit
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 hover:shadow-indigo-800/50"
                            : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50"
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
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
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          Share Your Story
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 md:py-14 px-4 border-t border-slate-800/50">
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
  );
}
