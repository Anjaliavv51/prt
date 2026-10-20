"use client";

import { useEffect, useState } from "react";
import { PortfolioContent } from "@/lib/portfolio-data";

export const PORTFOLIO_STORAGE_KEY = "portfolio_content_v1";
export const PORTFOLIO_UPDATED_EVENT = "portfolio_content_updated";
export const PORTFOLIO_BROADCAST_CHANNEL = "portfolio_live_sync_channel";

/**
 * Robustly merge two portfolio content objects preserving all sections
 */
export function mergePortfolioContent(
  base: PortfolioContent,
  override?: Partial<PortfolioContent> | null
): PortfolioContent {
  if (!override || typeof override !== "object") return base;

  return {
    ...base,
    ...override,
    profile: {
      ...(base.profile || {}),
      ...(override.profile || {}),
    },
    gridItems: override.gridItems !== undefined ? override.gridItems : (base.gridItems || []),
    projects: override.projects !== undefined ? override.projects : (base.projects || []),
    workExperience: override.workExperience !== undefined ? override.workExperience : (base.workExperience || []),
    certificates: override.certificates !== undefined ? override.certificates : (base.certificates || []),
    photography: override.photography !== undefined ? override.photography : (base.photography || []),
    socialMedia: override.socialMedia !== undefined ? override.socialMedia : (base.socialMedia || []),
    navItems: override.navItems !== undefined ? override.navItems : (base.navItems || []),
    updatedAt: override.updatedAt || base.updatedAt || new Date().toISOString(),
  };
}

/**
 * Get client-stored portfolio content merged cleanly with initial server content
 */
export function getStoredPortfolioContent(initial: PortfolioContent): PortfolioContent {
  if (typeof window === "undefined") return initial;

  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return initial;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return initial;

    // Merge stored content over initial content so all admin edits are retained
    return mergePortfolioContent(initial, parsed);
  } catch (err) {
    console.warn("Could not read portfolio content from localStorage:", err);
  }

  return initial;
}

/**
 * Save updated portfolio content to client-side localStorage, dispatch sync events,
 * and broadcast across all active browser tabs in real time.
 */
export function setStoredPortfolioContent(content: PortfolioContent): void {
  if (typeof window === "undefined") return;

  try {
    const toStore: PortfolioContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(toStore));

    // 1. Dispatch custom event for current window
    window.dispatchEvent(
      new CustomEvent(PORTFOLIO_UPDATED_EVENT, { detail: toStore })
    );

    // 2. Broadcast to other open browser tabs/windows
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const channel = new BroadcastChannel(PORTFOLIO_BROADCAST_CHANNEL);
        channel.postMessage({ type: "SYNC_PORTFOLIO", payload: toStore });
        channel.close();
      } catch (bcErr) {
        console.warn("BroadcastChannel postMessage error:", bcErr);
      }
    }
  } catch (err) {
    console.warn("Could not save portfolio content to localStorage:", err);
  }
}

/**
 * React hook that returns live portfolio content synced across all tabs,
 * pages, and components in real time.
 */
export function useLivePortfolioContent(initial: PortfolioContent): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>(() =>
    getStoredPortfolioContent(initial)
  );

  useEffect(() => {
    // 1. Initial sync from localStorage on mount
    const latestStored = getStoredPortfolioContent(initial);
    setContent(latestStored);

    // 2. Listen for intra-tab updates (dispatched by admin operations in the same window)
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PortfolioContent>;
      if (customEvent.detail) {
        setContent((curr) => mergePortfolioContent(curr, customEvent.detail));
      } else {
        setContent(getStoredPortfolioContent(initial));
      }
    };

    // 3. Listen for cross-tab storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PORTFOLIO_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setContent((curr) => mergePortfolioContent(curr, parsed));
        } catch {}
      }
    };

    // 4. Listen for real-time BroadcastChannel messages from other tabs
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        broadcastChannel = new BroadcastChannel(PORTFOLIO_BROADCAST_CHANNEL);
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === "SYNC_PORTFOLIO" && event.data?.payload) {
            setContent((curr) => mergePortfolioContent(curr, event.data.payload));
          }
        };
      } catch (bcErr) {
        console.warn("BroadcastChannel listener setup failed:", bcErr);
      }
    }

    // 5. Background revalidation from server API to pull any remote updates
    let isCancelled = false;
    fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && data?.content) {
          setContent((curr) => {
            const merged = mergePortfolioContent(curr, data.content);
            try {
              // Update local storage if server payload has updates
              localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {
        // Silently ignore network failures in offline / disconnected mode
      });

    window.addEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isCancelled = true;
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorageChange);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [initial]);

  return content;
}
