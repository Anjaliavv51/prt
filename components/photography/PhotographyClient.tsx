/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PhotographItem, PortfolioContent } from "@/lib/portfolio-data";
import { useLivePortfolioContent } from "@/lib/client-content-sync";
import { Spotlight } from "@/components/ui/Spotlight";
import {
  FaArrowLeft,
  FaCamera,
  FaAward,
  FaMagnifyingGlassPlus,
  FaXmark,
  FaInstagram,
  FaLocationDot,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
} from "react-icons/fa6";

interface PhotographyClientProps {
  initialContent: PortfolioContent;
}

export default function PhotographyClient({
  initialContent,
}: PhotographyClientProps) {
  const content = useLivePortfolioContent(initialContent);
  const photographs = content.photography || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<PhotographItem | null>(null);

  // Extract unique categories
  const categories = [
    "All",
    ...Array.from(new Set(photographs.map((p) => p.category || "General"))),
  ];

  const filteredPhotographs =
    selectedCategory === "All"
      ? photographs
      : photographs.filter((p) => p.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhoto(null);
      } else if (e.key === "ArrowRight" && activePhoto) {
        const currIdx = filteredPhotographs.findIndex(
          (p) => p.id === activePhoto.id
        );
        if (currIdx < filteredPhotographs.length - 1) {
          setActivePhoto(filteredPhotographs[currIdx + 1]);
        }
      } else if (e.key === "ArrowLeft" && activePhoto) {
        const currIdx = filteredPhotographs.findIndex(
          (p) => p.id === activePhoto.id
        );
        if (currIdx > 0) {
          setActivePhoto(filteredPhotographs[currIdx - 1]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, filteredPhotographs]);

  return (
    <div className="min-h-screen bg-black-100 text-white relative overflow-hidden px-4 sm:px-8 py-10 selection:bg-purple selection:text-white">
      {/* Background Lighting & Grid */}
      <Spotlight
        className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
        fill="white"
      />
      <Spotlight
        className="top-10 left-full h-[80vh] w-[50vw]"
        fill="purple"
      />
      <Spotlight
        className="top-28 left-80 h-[80vh] w-[50vw]"
        fill="blue"
      />

      <div className="fixed inset-0 w-full h-full pointer-events-none dark:bg-grid-white/[0.04] bg-grid-black/[0.1] -z-10" />

      {/* Top Header / Navigation Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 mb-8 border-b border-white/[0.08]">
        {/* Same tab link back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Instagram Action */}
          <a
            href="https://www.instagram.com/nameits.any"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 text-xs font-semibold text-pink-300 hover:text-white hover:bg-pink-500/20 transition-all"
            title="DM on Instagram for Video Editing and Photography"
          >
            <FaInstagram className="text-sm" />
            <span className="hidden sm:inline">Instagram</span>
          </a>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Admin Dashboard"
          >
            <FaLock className="text-[10px]" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      {/* Page Title & Honors Banner */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
          <FaAward className="text-yellow-400 text-sm" />
          <span>2nd Place Winner — Structures & Macro Photography</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Photography & <span className="text-purple">Visual Art</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A curated collection of my best captures celebrating perspective, geometric lines,
          and micro natural details. Awarded 2nd Place in both Structures and Macro categories by Drśya Multimedia Club.
        </p>

        {/* Quick DM CTA */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://www.instagram.com/nameits.any"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple/30 to-pink-500/20 hover:from-purple/50 hover:to-pink-500/40 border border-purple/40 text-xs sm:text-sm font-medium text-white transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(203,172,249,0.3)]"
          >
            <FaInstagram className="text-pink-400 text-base" />
            <span>DM on Instagram for Video Editing & Photography</span>
          </a>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count =
              category === "All"
                ? photographs.length
                : photographs.filter((p) => p.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-purple text-black-100 font-bold shadow-[0_0_20px_rgba(203,172,249,0.5)]"
                    : "bg-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.1] border border-white/[0.08]"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-black-100/30 text-black-100"
                      : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Photographs Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredPhotographs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <FaCamera className="text-4xl text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium">No photographs in this category yet.</p>
            <p className="text-xs text-neutral-500 mt-1">Upload and manage photographs anytime via the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographs.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c102a]/80 hover:border-purple/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(203,172,249,0.25)] flex flex-col cursor-pointer"
              >
                {/* Photo Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c102a] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md border border-white/15 text-neutral-200">
                      {photo.category}
                    </span>
                  </div>

                  {/* Award Badge if Present */}
                  {photo.award && (
                    <div className="absolute top-3 right-3 max-w-[70%]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 text-yellow-300 truncate">
                        <FaAward className="text-yellow-400 shrink-0 text-xs" />
                        <span className="truncate">{photo.award}</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-purple/90 text-black-100 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <FaMagnifyingGlassPlus className="text-lg" />
                    </div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    {photo.caption && (
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500">
                    {photo.location ? (
                      <span className="flex items-center gap-1 text-neutral-400 truncate max-w-[150px]">
                        <FaLocationDot className="text-purple/80 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </span>
                    ) : (
                      <span>Featured Capture</span>
                    )}

                    <span className="text-purple/80 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6"
        >
          {/* Backdrop click dismiss */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setActivePhoto(null)}
          />

          <div className="relative z-10 w-full max-w-5xl bg-[#0c102a] border border-purple/40 rounded-3xl shadow-[0_0_60px_rgba(203,172,249,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple/20 border border-purple/40 flex items-center justify-center text-purple text-xl shrink-0">
                  <FaCamera />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                    {activePhoto.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-purple/20 text-purple border border-purple/30">
                      {activePhoto.category}
                    </span>
                    {activePhoto.award && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                        <FaAward className="text-yellow-400" />
                        <span>{activePhoto.award}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <FaXmark className="text-lg" />
              </button>
            </div>

            {/* Modal Body / Image View */}
            <div className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[60vh] p-3">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain rounded-xl select-none"
              />

              {/* Prev / Next Controls */}
              {filteredPhotographs.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currIdx = filteredPhotographs.findIndex(
                        (p) => p.id === activePhoto.id
                      );
                      if (currIdx > 0) {
                        setActivePhoto(filteredPhotographs[currIdx - 1]);
                      } else {
                        setActivePhoto(
                          filteredPhotographs[filteredPhotographs.length - 1]
                        );
                      }
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                    title="Previous photo"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currIdx = filteredPhotographs.findIndex(
                        (p) => p.id === activePhoto.id
                      );
                      if (currIdx < filteredPhotographs.length - 1) {
                        setActivePhoto(filteredPhotographs[currIdx + 1]);
                      } else {
                        setActivePhoto(filteredPhotographs[0]);
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                    title="Next photo"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer / Details */}
            <div className="p-5 border-t border-white/10 bg-[#090d22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                {activePhoto.caption && (
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                )}
                {activePhoto.location && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
                    <FaLocationDot className="text-purple" />
                    <span>Location: {activePhoto.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href="https://www.instagram.com/nameits.any"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-xs font-semibold text-pink-300 hover:text-white transition-all shadow-[0_0_20px_rgba(244,114,182,0.2)]"
                >
                  <FaInstagram className="text-base" />
                  <span>Inquire on Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
