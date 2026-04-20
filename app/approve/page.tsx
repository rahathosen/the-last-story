"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";

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
  isApproved: boolean;
  createdAt: string;
}

export default function AdminApprovePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStories();
    }
  }, [isAuthenticated, sortBy, sortOrder, statusFilter]);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, statusFilter]);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/stories");
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const error = await response.json();
        setAuthError(error.error || "Login failed");
      }
    } catch {
      setAuthError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setStories([]);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const response = await fetch(`/api/admin/stories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStories = () => {
    let filtered = [...stories];
    if (statusFilter === "approved") {
      filtered = filtered.filter((s) => s.isApproved);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((s) => !s.isApproved);
    }
    setFilteredStories(filtered);
  };

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const response = await fetch("/api/admin/stories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      if (response.ok) fetchStories();
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this story? This cannot be undone.",
      )
    )
      return;
    try {
      const response = await fetch(`/api/admin/stories?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchStories();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShareableUrl = (slug: string) => {
    if (typeof window === "undefined") return `/story/${slug}`;
    return `${window.location.origin}/story/${slug}`;
  };

  const handleCopyUrl = (id: string, slug: string) => {
    navigator.clipboard.writeText(getShareableUrl(slug));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Export helpers ──────────────────────────────────────────────────

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const data = filteredStories.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name || "Anonymous",
      title: s.title || null,
      content: s.content,
      isApproved: s.isApproved,
      createdAt: s.createdAt,
      socialMedia: s.socialMedia || null,
      url: getShareableUrl(s.slug),
    }));
    downloadFile(
      JSON.stringify(data, null, 2),
      `stories-${Date.now()}.json`,
      "application/json",
    );
    setExportOpen(false);
  };

  const exportAsCSV = () => {
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const headers = [
      "ID",
      "Slug",
      "Name",
      "Title",
      "Content",
      "Status",
      "Created At",
      "Social Platform",
      "Social URL",
      "Story URL",
    ];
    const rows = filteredStories.map((s) => [
      esc(s.id),
      esc(s.slug),
      esc(s.name || "Anonymous"),
      esc(s.title || ""),
      esc(s.content),
      esc(s.isApproved ? "Approved" : "Pending"),
      esc(s.createdAt),
      esc(s.socialMedia?.platform || ""),
      esc(s.socialMedia?.url || ""),
      esc(getShareableUrl(s.slug)),
    ]);
    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    downloadFile(
      "\uFEFF" + csv,
      `stories-${Date.now()}.csv`,
      "text/csv;charset=utf-8;",
    );
    setExportOpen(false);
  };

  const exportAsTXT = () => {
    const sep = "═".repeat(60);
    const text = filteredStories
      .map((s, i) =>
        [
          sep,
          `Story #${i + 1}  —  ${s.isApproved ? "APPROVED" : "PENDING"}`,
          sep,
          `Title   : ${s.title || "(untitled)"}`,
          `Author  : ${s.name || "Anonymous"}`,
          `Date    : ${formatDate(s.createdAt)}`,
          s.socialMedia
            ? `Social  : ${s.socialMedia.platform}  →  ${s.socialMedia.url}`
            : "",
          `URL     : ${getShareableUrl(s.slug)}`,
          "",
          s.content,
        ]
          .filter((l) => l !== "")
          .join("\n"),
      )
      .join("\n\n");
    downloadFile(
      text,
      `stories-${Date.now()}.txt`,
      "text/plain;charset=utf-8;",
    );
    setExportOpen(false);
  };

  // ── Computed counts ─────────────────────────────────────────────────
  const totalCount = stories.length;
  const approvedCount = stories.filter((s) => s.isApproved).length;
  const pendingCount = stories.filter((s) => !s.isApproved).length;

  // ── Login screen ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-2xl font-serif text-slate-200 hover:text-white transition-colors"
            >
              The Last Story
            </Link>
            <p className="text-slate-500 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Card */}
          <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="p-7">
              {/* Lock badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-serif text-slate-100 text-center mb-6">
                Sign in to Admin
              </h1>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-900/30 border border-rose-700/40 flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 text-rose-400 shrink-0"
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
                  <p className="text-rose-300 text-sm">{authError}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-slate-400"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full h-10 px-3 rounded-lg bg-slate-900/50 border border-slate-700/60 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 px-3 rounded-lg bg-slate-900/50 border border-slate-700/60 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-900/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-slate-700 text-xs mt-6">
            <Link href="/" className="hover:text-slate-500 transition-colors">
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-slate-900/85 backdrop-blur-sm border-b border-slate-800/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-base font-serif text-slate-200 hover:text-white transition-colors"
            >
              The Last Story
            </Link>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              Admin Panel
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl md:text-3xl font-serif text-slate-100 mb-1">
            Story Management
          </h1>
          <p className="text-slate-500 text-sm">
            Review, approve, and manage all submitted stories.
          </p>
        </div>

        {/* Stats + Export row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Total */}
          <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden p-4 backdrop-blur-sm">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent absolute top-0 left-0 right-0" />
            <p className="text-2xl font-bold text-slate-100 tabular-nums">
              {totalCount}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Total Stories</p>
          </div>

          {/* Approved */}
          <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden p-4 backdrop-blur-sm">
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent absolute top-0 left-0 right-0" />
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">
              {approvedCount}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Approved</p>
          </div>

          {/* Pending */}
          <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden p-4 backdrop-blur-sm">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent absolute top-0 left-0 right-0" />
            <p className="text-2xl font-bold text-amber-400 tabular-nums">
              {pendingCount}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Pending Review</p>
          </div>

          {/* Export dropdown */}
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setExportOpen((o) => !o)}
              className="w-full h-full min-h-[72px] flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all text-sm font-medium"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${exportOpen ? "rotate-180" : ""}`}
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

            {/* Dropdown menu */}
            {exportOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800/95 border border-slate-700/50 rounded-xl shadow-xl shadow-slate-950/50 backdrop-blur-sm z-30 overflow-hidden">
                <div className="p-1.5">
                  <p className="text-xs text-slate-600 px-3 py-1.5 uppercase tracking-wider font-medium">
                    Export {filteredStories.length} stories
                  </p>

                  <button
                    onClick={exportAsJSON}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Export as JSON
                      </p>
                      <p className="text-xs text-slate-500">
                        Structured data format
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={exportAsCSV}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Export as CSV
                      </p>
                      <p className="text-xs text-slate-500">
                        Open in Excel / Sheets
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={exportAsTXT}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Export as TXT
                      </p>
                      <p className="text-xs text-slate-500">
                        Human-readable text
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters bar */}
        <div className="relative bg-slate-800/40 border border-slate-700/40 rounded-xl backdrop-blur-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 bg-slate-900/50 border-slate-700/60 text-slate-200 text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 rounded-xl">
                  <SelectItem
                    value="all"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    All Stories
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Pending Only
                  </SelectItem>
                  <SelectItem
                    value="approved"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Approved Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 bg-slate-900/50 border-slate-700/60 text-slate-200 text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 rounded-xl">
                  <SelectItem
                    value="createdAt"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Date Created
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Author Name
                  </SelectItem>
                  <SelectItem
                    value="title"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Story Title
                  </SelectItem>
                  <SelectItem
                    value="isApproved"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Approval Status
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                Order
              </label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-9 bg-slate-900/50 border-slate-700/60 text-slate-200 text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 rounded-xl">
                  <SelectItem
                    value="desc"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Newest First
                  </SelectItem>
                  <SelectItem
                    value="asc"
                    className="text-slate-200 focus:bg-slate-700 rounded-lg"
                  >
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchStories}
                disabled={loading}
                className="w-full h-9 flex items-center justify-center gap-2 rounded-lg text-sm text-slate-300 hover:text-slate-100 border border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-700/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {filteredStories.length > 0 && (
          <p className="text-slate-600 text-xs mb-4 tabular-nums">
            Showing {filteredStories.length} of {totalCount} stories
          </p>
        )}

        {/* Story cards */}
        <div className="space-y-4">
          {loading && filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto" />
              <p className="text-slate-500 text-sm mt-4">Loading stories…</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 border border-slate-700/30 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                {statusFilter === "all"
                  ? "No stories submitted yet."
                  : `No ${statusFilter} stories found.`}
              </p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story.id}
                className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-slate-800/55 hover:border-slate-600/50 transition-all duration-200"
              >
                {/* Top gradient accent — green for approved, amber for pending */}
                <div
                  className={`h-px bg-gradient-to-r from-transparent to-transparent ${
                    story.isApproved ? "via-emerald-500/50" : "via-amber-500/50"
                  }`}
                />

                <div className="p-5 md:p-6">
                  {/* Top row: status badge + date */}
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        story.isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          story.isApproved ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      {story.isApproved ? "Approved" : "Pending Review"}
                    </span>
                    <time className="text-xs text-slate-500 tabular-nums shrink-0">
                      {formatDate(story.createdAt)}
                    </time>
                  </div>

                  {/* Title */}
                  {story.title && (
                    <h3 className="text-lg md:text-xl font-serif text-slate-100 mb-3 leading-snug">
                      {story.title}
                    </h3>
                  )}

                  {/* Author row */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <UserAvatar name={story.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-300 leading-tight">
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
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          {story.socialMedia.platform}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content preview */}
                  <p
                    className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5"
                    style={{
                      fontFamily: "SolaimanLipi, Kalpurush, Arial, sans-serif",
                    }}
                  >
                    {story.content}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-slate-700/50 mb-4" />

                  {/* URL row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs text-slate-600 shrink-0">
                      URL:
                    </span>
                    <code className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700/50 px-2.5 py-1.5 rounded-lg text-slate-400 text-xs truncate font-mono">
                      {getShareableUrl(story.slug)}
                    </code>
                    <button
                      onClick={() => handleCopyUrl(story.id, story.slug)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all duration-200 shrink-0 ${
                        copiedId === story.id
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "text-slate-400 hover:text-slate-200 border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-700/60"
                      }`}
                    >
                      {copiedId === story.id ? (
                        <>
                          <svg
                            className="w-3 h-3"
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
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!story.isApproved && (
                      <button
                        onClick={() => handleApprove(story.id, true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 hover:text-emerald-300 transition-all"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Approve
                      </button>
                    )}

                    {story.isApproved && (
                      <button
                        onClick={() => handleApprove(story.id, false)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 hover:text-amber-300 transition-all"
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                        Unapprove
                      </button>
                    )}

                    <Link
                      href={`/story/${story.slug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/50 hover:text-slate-200 hover:border-slate-600/60 hover:bg-slate-700/60 transition-all"
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Story
                    </Link>

                    <button
                      onClick={() => handleDelete(story.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all ml-auto"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
