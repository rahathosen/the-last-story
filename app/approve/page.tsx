"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/stories");
      if (response.ok) {
        setIsAuthenticated(true);
        fetchStories();
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
        fetchStories();
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
      const response = await fetch("/api/admin/stories");
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-slate-200">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-900/50 border border-red-700/50 rounded text-red-300 text-sm">
                  {authError}
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-slate-300 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* Header */}
      <header className="py-4 px-4 border-b border-slate-700/50">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-serif text-slate-200 hover:text-white transition-colors"
            >
              The Last Story
            </Link>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              Admin Panel
            </Badge>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            Logout
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-200 mb-2">
            Story Management
          </h1>
          <p className="text-slate-400">Review and approve submitted stories</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-200">
                {stories.length}
              </div>
              <div className="text-slate-400 text-sm">Total Stories</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">
                {stories.filter((s) => s.isApproved).length}
              </div>
              <div className="text-slate-400 text-sm">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {stories.filter((s) => !s.isApproved).length}
              </div>
              <div className="text-slate-400 text-sm">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Stories List */}
        <div className="space-y-6">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {story.title && (
                        <h3 className="text-xl font-serif text-slate-200">
                          {story.title}
                        </h3>
                      )}
                      <Badge
                        variant={story.isApproved ? "default" : "secondary"}
                        className={
                          story.isApproved ? "bg-green-600" : "bg-yellow-600"
                        }
                      >
                        {story.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <span>By {story.name || "Anonymous"}</span>
                      <span>•</span>
                      <span>{formatDate(story.createdAt)}</span>
                      {story.socialMedia && (
                        <>
                          <span>•</span>
                          <span>{story.socialMedia.platform}</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {story.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>Shareable URL:</span>
                      <code className="bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                        {getShareableUrl(story.slug)}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-slate-600 bg-transparent"
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
                </div>

                <div className="flex gap-2">
                  {!story.isApproved && (
                    <Button
                      onClick={() => handleApprove(story.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                  )}
                  {story.isApproved && (
                    <Button
                      onClick={() => handleApprove(story.id, false)}
                      variant="outline"
                      className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
                    >
                      Unapprove
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(story.id)}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    Delete
                  </Button>
                  <Link
                    href={`/story/${story.slug}`}
                    target="_blank"
                    className="inline-flex items-center px-3 py-2 text-sm border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    View Story
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {stories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                No stories submitted yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
