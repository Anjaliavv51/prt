"use client";

import { useEffect, useState } from "react";
import { PortfolioContent } from "@/lib/portfolio-data";

export const PORTFOLIO_STORAGE_KEY = "portfolio_content_v1";
export const PORTFOLIO_UPDATED_EVENT = "portfolio_content_updated";

/**
 * Get client-stored portfolio content or fallback to initial server content
 */
export function getStoredPortfolioContent(initial: PortfolioContent): PortfolioContent {
  if (typeof window === "undefined") return initial;

  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return initial;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return initial;

    const storedDate = parsed.updatedAt ? new Date(parsed.updatedAt).getTime() : 0;
    const initialDate = initial.updatedAt ? new Date(initial.updatedAt).getTime() : 0;

    // Use stored content if newer or matching, or if client has customized data
    if (storedDate >= initialDate || !initialDate) {
      return {
        ...initial,
        ...parsed,
        profile: { ...initial.profile, ...(parsed.profile || {}) },
        certificates: parsed.certificates !== undefined ? parsed.certificates : initial.certificates,
        photography: parsed.photography !== undefined ? parsed.photography : initial.photography,
      };
    } else {
      // Server baseline is newer than old local storage; refresh local storage with server baseline
      try {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(initial));
      } catch {}
      return initial;
    }
  } catch (err) {
    console.warn("Could not read portfolio content from localStorage:", err);
  }

  return initial;
}

/**
 * Save updated portfolio content to client-side localStorage and dispatch sync event
 */
export function setStoredPortfolioContent(content: PortfolioContent): void {
  if (typeof window === "undefined") return;

  try {
    const toStore = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(toStore));
    window.dispatchEvent(
      new CustomEvent(PORTFOLIO_UPDATED_EVENT, { detail: toStore })
    );
  } catch (err) {
    console.warn("Could not save portfolio content to localStorage:", err);
  }
}

/**
 * React hook that returns live portfolio content synced across all tabs and components
 */
export function useLivePortfolioContent(initial: PortfolioContent): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>(() => getStoredPortfolioContent(initial));

  useEffect(() => {
    // Sync on mount
    setContent(getStoredPortfolioContent(initial));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PortfolioContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(getStoredPortfolioContent(initial));
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PORTFOLIO_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setContent((curr) => ({
            ...curr,
            ...parsed,
            profile: { ...curr.profile, ...(parsed.profile || {}) },
            certificates: parsed.certificates !== undefined ? parsed.certificates : curr.certificates,
            photography: parsed.photography !== undefined ? parsed.photography : curr.photography,
          }));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [initial]);

  return content;
}
