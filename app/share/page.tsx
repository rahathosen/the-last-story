"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // Reset form after showing thank you message
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
        error instanceof Error ? error.message : "Failed to submit story"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedPlatformIcon = () => {
    if (!formData.socialMedia) return null;
    const platform = socialPlatforms.find(
      (p) => p.value === formData.socialMedia?.platform
    );
    return platform?.icon;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-3 md:py-4 border-b border-border/30">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <Link
            href="/"
            className="text-lg md:text-xl font-serif text-foreground hover:text-accent transition-colors font-medium"
          >
            The Last Story
          </Link>
          <div className="flex gap-4 md:gap-4 lg:gap-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group flex items-center gap-1 md:gap-2"
            >
              <span className="hidden md:inline">Home</span>
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-muted-foreground flex items-center gap-1 md:gap-2">
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
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 md:mb-8 leading-tight font-semibold">
              Share Your Story
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto px-4">
              There is no wrong way to remember someone. Share a moment of love, memory, or final goodbye that touched your heart and may bring comfort to others.
            </p>
          </div>
          <div className="w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {showThankYou ? (
            <Card className="bg-card border-border/50 backdrop-blur-sm shadow-sm">
              <CardContent className="p-6 md:p-8 lg:p-12 text-center">
                <div className="mb-4 md:mb-6">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-accent mx-auto mb-3 md:mb-4"
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
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4 font-semibold">
                  Thank You
                </h2>
                <p className="text-muted-foreground text-base md:text-lg mb-4 md:mb-6">
                  Your story has been submitted successfully. It will be
                  reviewed and shared to help others find comfort in shared
                  experiences of love and loss.
                </p>
                <p className="text-muted-foreground/70 text-sm">
                  May your loved ones rest in peace, and may their memories
                  bring you comfort.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border/50 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4 md:p-6 lg:p-8">
                {error && (
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Personal Information */}
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-serif text-foreground border-b border-border pb-2 font-semibold">
                      Your Details
                    </h3>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-foreground mb-2 font-medium text-sm md:text-base"
                      >
                        Your Name (optional)
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
                        placeholder="Your story can be shared anonymously"
                        className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent text-sm md:text-base"
                      />
                    </div>

                    {/* Social Media Link */}
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg text-foreground font-medium">
                        Social Media Link (optional)
                      </h4>
                      <p className="text-muted-foreground text-xs md:text-sm">
                        Connect your story to your profile if you&rsquo;d like
                      </p>

                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <label className="block text-muted-foreground mb-2 text-xs md:text-sm">
                            Platform
                          </label>
                          <Select
                            value={formData.socialMedia?.platform || ""}
                            onValueChange={(value: SocialPlatform) =>
                              handleSocialPlatformChange(value)
                            }
                          >
                            <SelectTrigger className="bg-secondary border-border text-foreground text-sm md:text-base">
                              <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {socialPlatforms.map((platform) => (
                                <SelectItem
                                  key={platform.value}
                                  value={platform.value}
                                  className="text-foreground focus:bg-secondary text-sm md:text-base"
                                >
                                  <div className="flex items-center gap-2">
                                    <svg
                                      className="w-3 h-3 md:w-4 md:h-4"
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
                        </div>

                        {formData.socialMedia && (
                          <div>
                            <label className="block text-muted-foreground mb-2 text-xs md:text-sm">
                              Profile URL
                            </label>
                            <div className="relative">
                              {getSelectedPlatformIcon() && (
                                <svg
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground/50"
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
                                placeholder={`Enter your ${
                                  socialPlatforms.find(
                                    (p) =>
                                      p.value === formData.socialMedia?.platform
                                  )?.label
                                } profile URL`}
                                className="pl-8 md:pl-10 bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent text-sm md:text-base"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Story Information */}
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-serif text-foreground border-b border-border pb-2 font-semibold">
                      Your Story
                    </h3>

                    <div>
                      <label
                        htmlFor="title"
                        className="block text-foreground mb-2 font-medium text-sm md:text-base"
                      >
                        Story Title (optional)
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
                        placeholder="A meaningful title that honors their memory"
                        className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="story"
                        className="block text-foreground mb-2 font-medium text-sm md:text-base"
                      >
                        Your Story *
                      </label>
                      <Textarea
                        id="story"
                        value={formData.story}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            story: e.target.value,
                          }))
                        }
                        placeholder="Share your story of love, memory, or final moments... Words spoken, moments shared, love expressed. Write in any language that feels most natural."
                        rows={10}
                        className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent resize-none text-sm md:text-base min-h-[200px] md:min-h-[300px]"
                        style={{
                          fontFamily:
                            "SolaimanLipi, Kalpurush, Arial, sans-serif",
                        }}
                        required
                      />
                      <p className="text-muted-foreground text-xs md:text-sm mt-2">
                        Your words are handled with care. Share details that matter most.
                      </p>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-serif text-foreground border-b border-border pb-2 font-semibold">
                      Before We Share
                    </h3>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            consent: checked as boolean,
                          }))
                        }
                        className="mt-1 border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent flex-shrink-0"
                        required
                      />
                      <label
                        htmlFor="consent"
                        className="text-muted-foreground text-xs md:text-sm leading-relaxed"
                      >
                        I understand this story will be shared publicly to help
                        others find comfort in shared experiences of love and
                        loss. I confirm I have the right to share this story and
                        that it honors the memory and dignity of those mentioned.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 md:pt-8">
                    <Button
                      type="submit"
                      disabled={
                        !formData.story.trim() ||
                        !formData.consent ||
                        isSubmitting
                      }
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 md:py-4 text-base md:text-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 md:h-5 md:w-5"
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
                          <span className="text-sm md:text-base">
                            Submitting Your Story...
                          </span>
                        </div>
                      ) : (
                        "Share Your Story"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
