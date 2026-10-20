"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLock, FaUser, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Authenticating...");

  // Check if already authenticated
  useEffect(() => {
    let active = true;
    async function checkCurrentSession() {
      try {
        const res = await fetch("/api/admin/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && active) {
            window.location.replace("/admin");
            return;
          }
        }
      } catch {
        // Not authenticated
      } finally {
        if (active) setCheckingAuth(false);
      }
    }
    checkCurrentSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setStatusText("Authenticating...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      // Successful login - hard navigation guarantees fresh cookie attach without Next.js router cache delays
      setStatusText("Success! Opening Dashboard...");
      window.location.replace("/admin");
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setError("Authentication request timed out. Please check your network and try again.");
      } else {
        setError("An unexpected network error occurred. Please try again.");
      }
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black-100 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-white-100 text-sm">Verifying session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative bg-black-100 flex items-center justify-center px-4 overflow-hidden">
      {/* Background radial gradient and grid matching portfolio */}
      <div className="absolute inset-0 dark:bg-grid-white/[0.05] bg-grid-black/[0.2] pointer-events-none" />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Decorative ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to portfolio button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white-100 hover:text-purple transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to Public Portfolio
          </Link>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-black-200 border border-white/[0.1] backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple/10 border border-purple/30 flex items-center justify-center text-purple text-2xl shadow-[0_0_20px_rgba(203,172,249,0.2)]">
              <FaLock />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-sm text-white-100 mt-2">
              Sign in to manage your portfolio content
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white-100 font-semibold mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white-200">
                  <FaUser className="text-sm" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="plpanjali05"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-100/80 border border-white/[0.15] text-white placeholder-white-200/50 text-sm focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white-100 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white-200">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black-100/80 border border-white/[0.15] text-white placeholder-white-200/50 text-sm focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white-200 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-black bg-purple hover:bg-purple/90 focus:outline-none focus:ring-2 focus:ring-purple/50 shadow-[0_0_25px_rgba(203,172,249,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{statusText}</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-white-200/60">
              Private administrator interface. Public registration is disabled.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
