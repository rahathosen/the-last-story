"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const error = await response.json();
        setAuthError(error.error || "Login failed");
      }
    } catch (error) {
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
    }
  };

  const filterAndSortStories = () => {
    let filtered = [...stories];

    if (statusFilter === "approved") {
      filtered = filtered.filter((story) => story.isApproved);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((story) => !story.isApproved);
    }

    setFilteredStories(filtered);
  };

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const response = await fetch("/api/admin/stories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isApproved }),
      });

      if (response.ok) {
        fetchStories(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const response = await fetch(`/api/admin/stories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStories(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShareableUrl = (slug: string) => {
    return `${window.location.origin}/story/${slug}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl font-serif text-foreground">
              Admin Access
            </CardTitle>
            <p className="text-center text-muted-foreground text-sm">
              Manage and approve stories
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive text-sm font-medium">
                  {authError}
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-foreground mb-2 font-medium text-sm">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-foreground mb-2 font-medium text-sm">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border/30 sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <nav className="container mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-serif text-foreground hover:text-accent transition-colors font-medium"
            >
              The Last Story
            </Link>
            <Badge variant="secondary" className="bg-secondary text-foreground text-xs">
              Admin Panel
            </Badge>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-border text-muted-foreground hover:bg-secondary bg-transparent text-sm"
          >
            Logout
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2 font-semibold">
            Story Management
          </h1>
          <p className="text-muted-foreground">Review, approve, and manage submitted stories</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-5 md:p-6">
              <div className="text-3xl font-bold text-foreground">
                {stories.length}
              </div>
              <div className="text-muted-foreground text-sm mt-1">Total Stories</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-5 md:p-6">
              <div className="text-3xl font-bold text-green-400">
                {stories.filter((s) => s.isApproved).length}
              </div>
              <div className="text-muted-foreground text-sm mt-1">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-5 md:p-6">
              <div className="text-3xl font-bold text-yellow-400">
                {stories.filter((s) => !s.isApproved).length}
              </div>
              <div className="text-muted-foreground text-sm mt-1">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sorting */}
        <Card className="bg-card border-border/50 mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem
                        value="all"
                        className="text-foreground focus:bg-secondary"
                      >
                        All Stories
                      </SelectItem>
                      <SelectItem
                        value="pending"
                        className="text-foreground focus:bg-secondary"
                      >
                        Pending Only
                      </SelectItem>
                      <SelectItem
                        value="approved"
                        className="text-foreground focus:bg-secondary"
                      >
                        Approved Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem
                        value="createdAt"
                        className="text-foreground focus:bg-secondary"
                      >
                        Date Created
                      </SelectItem>
                      <SelectItem
                        value="name"
                        className="text-foreground focus:bg-secondary"
                      >
                        Author Name
                      </SelectItem>
                      <SelectItem
                        value="title"
                        className="text-foreground focus:bg-secondary"
                      >
                        Story Title
                      </SelectItem>
                      <SelectItem
                        value="isApproved"
                        className="text-foreground focus:bg-secondary"
                      >
                        Approval Status
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-foreground mb-2 text-sm font-medium">
                    Order
                  </label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem
                        value="desc"
                        className="text-foreground focus:bg-secondary"
                      >
                        Descending
                      </SelectItem>
                      <SelectItem
                        value="asc"
                        className="text-foreground focus:bg-secondary"
                      >
                        Ascending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={fetchStories}
                  className="flex-1 min-w-[140px] bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                >
                  Apply
                </Button>
                <Button
                  onClick={async () => {
                    const response = await fetch("/api/admin/stories?format=csv");
                    const csv = await response.text();
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `stories-${new Date().toISOString().split("T")[0]}.csv`;
                    a.click();
                  }}
                  variant="outline"
                  className="flex-1 min-w-[140px] border-border text-muted-foreground hover:bg-secondary font-medium"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories List */}
        <div className="space-y-4">
          {filteredStories.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No stories found</p>
              </CardContent>
            </Card>
          ) : (
            filteredStories.map((story) => (
              <Card
                key={story.id}
                className="bg-card border-border/50 backdrop-blur-sm hover:border-border/70 transition-all"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Title and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        {story.title && (
                          <h3 className="text-lg md:text-xl font-serif text-foreground font-semibold">
                            {story.title}
                          </h3>
                        )}
                      </div>
                      <Badge
                        variant={story.isApproved ? "default" : "secondary"}
                        className={`w-fit ${
                          story.isApproved
                            ? "bg-green-600/80 text-white"
                            : "bg-yellow-600/80 text-white"
                        }`}
                      >
                        {story.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>

                    {/* Author and Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={story.name} size="sm" />
                        <span className="font-medium text-foreground">
                          {story.name || "Anonymous"}
                        </span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs md:text-sm">{formatDate(story.createdAt)}</span>
                      {story.socialMedia && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs md:text-sm bg-secondary px-2 py-1 rounded">
                            {story.socialMedia.platform}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Content Preview */}
                    <p className="text-foreground leading-7 line-clamp-3 text-sm md:text-base">
                      {story.content}
                    </p>

                    {/* Shareable URL */}
                    <div className="bg-secondary/30 border border-border/50 rounded-lg p-3 md:p-4">
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">
                        Shareable Link:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <code className="bg-background px-3 py-2 rounded text-foreground text-xs break-all flex-1">
                          {getShareableUrl(story.slug)}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground hover:bg-secondary w-full sm:w-auto text-xs"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              getShareableUrl(story.slug)
                            )
                          }
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap pt-2">
                      {!story.isApproved && (
                        <Button
                          onClick={() => handleApprove(story.id, true)}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-medium"
                        >
                          Approve
                        </Button>
                      )}
                      {story.isApproved && (
                        <Button
                          onClick={() => handleApprove(story.id, false)}
                          variant="outline"
                          className="flex-1 sm:flex-none border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 font-medium"
                        >
                          Unapprove
                        </Button>
                      )}
                      <Link
                        href={`/story/${story.slug}`}
                        target="_blank"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm border border-border text-muted-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
                      >
                        View Story ↗
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
