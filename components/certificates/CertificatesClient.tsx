/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CertificateItem, PortfolioContent } from "@/lib/portfolio-data";
import { useLivePortfolioContent } from "@/lib/client-content-sync";
import { Spotlight } from "@/components/ui/Spotlight";
import {
  FaArrowLeft,
  FaAward,
  FaMagnifyingGlassPlus,
  FaXmark,
  FaShieldHalved,
  FaCalendarDays,
  FaBuildingColumns,
  FaIdCard,
  FaLayerGroup,
  FaLock,
} from "react-icons/fa6";

interface CertificatesClientProps {
  initialContent: PortfolioContent;
}

export default function CertificatesClient({
  initialContent,
}: CertificatesClientProps) {
  const content = useLivePortfolioContent(initialContent);
  const certificates = content.certificates || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Extract unique categories
  const categories = [
    "All",
    ...Array.from(new Set(certificates.map((c) => c.category || "Other"))),
  ];

  const filteredCertificates =
    selectedCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === selectedCategory);

  // Reset active page index when changing active certificate
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeCertificate]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCertificate(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentModalImages = activeCertificate
    ? [
        activeCertificate.image,
        ...(activeCertificate.additionalImages || []),
      ].filter(Boolean)
    : [];

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

      {/* Top Header / Back Navigation */}
      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 mb-8 border-b border-white/[0.08]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Admin Login & Management"
          >
            <FaLock className="text-[10px]" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Title Section */}
      <div className="max-w-7xl mx-auto text-center my-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/30 text-purple text-xs font-semibold uppercase tracking-wider mb-4">
          <FaAward className="text-yellow-400" />
          <span>Verified Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Research Papers &{" "}
          <span className="text-purple">Achievements</span>
        </h1>
        <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
          Official peer-reviewed conference presentation certificates, academic
          publications, and recognized open-source contributions.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-purple text-white shadow-lg shadow-purple/30 border border-purple"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certificates Grid */}
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertificates.map((cert) => {
          const hasMultiplePages =
            cert.additionalImages && cert.additionalImages.length > 0;

          return (
            <div
              key={cert.id}
              className="group relative rounded-2xl bg-[#0e122b]/90 border border-white/[0.1] hover:border-purple/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-purple/20"
            >
              <div>
                {/* Certificate Preview Image Box */}
                <div
                  onClick={() => setActiveCertificate(cert)}
                  className="relative w-full h-56 bg-black-200 overflow-hidden cursor-pointer flex items-center justify-center p-3 border-b border-white/[0.08]"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-lg shadow-md"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <FaMagnifyingGlassPlus className="text-3xl text-purple animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide bg-purple/80 px-3 py-1 rounded-full">
                      Click to Preview
                    </span>
                  </div>

                  {/* Multi-page badge indicator */}
                  {hasMultiplePages && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 text-neutral-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaLayerGroup className="text-purple" />
                      <span>
                        {(cert.additionalImages?.length || 0) + 1} Pages
                      </span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#13162D]/90 backdrop-blur-md border border-purple/30 text-purple-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {cert.category}
                  </div>
                </div>

                {/* Certificate Body Information */}
                <div className="p-5">
                  <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-purple transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  {cert.subtitle && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                      {cert.subtitle}
                    </p>
                  )}

                  <div className="mt-4 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <FaBuildingColumns className="text-purple flex-shrink-0" />
                      <span className="truncate">{cert.issuer}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarDays className="text-neutral-400 flex-shrink-0" />
                      <span>{cert.issueDate}</span>
                    </div>

                    {cert.credentialId && (
                      <div className="flex items-center gap-2">
                        <FaIdCard className="text-amber-400 flex-shrink-0" />
                        <span className="font-mono text-[11px] bg-white/[0.05] px-2 py-0.5 rounded border border-white/10 truncate">
                          {cert.credentialId}
                        </span>
                      </div>
                    )}
                  </div>

                  {cert.description && (
                    <p className="mt-3 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-white/[0.06] mt-4 pt-4">
                <button
                  onClick={() => setActiveCertificate(cert)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple/15 hover:bg-purple text-purple hover:text-black border border-purple/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(203,172,249,0.1)] hover:shadow-[0_0_20px_rgba(203,172,249,0.3)]"
                >
                  <FaMagnifyingGlassPlus />
                  <span>Preview Certificate</span>
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* Interactive Certificate Lightbox Modal */}
      {activeCertificate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6"
        >
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setActiveCertificate(null)}
          />

          <div className="relative z-10 w-full max-w-5xl bg-[#0c102a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-purple font-semibold bg-purple/10 px-2 py-0.5 rounded border border-purple/20">
                    {activeCertificate.category}
                  </span>
                  {activeCertificate.credentialId && (
                    <span className="font-mono text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {activeCertificate.credentialId}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
                  {activeCertificate.title}
                </h2>
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {activeCertificate.issuer} • {activeCertificate.issueDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-300 flex items-center gap-1.5 bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/10 select-none">
                  <FaShieldHalved className="text-purple text-xs" />
                  <span className="hidden sm:inline">Protected View</span>
                </span>

                <button
                  onClick={() => setActiveCertificate(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <FaXmark />
                </button>
              </div>
            </div>

            {/* Multi-page Navigation Selector */}
            {currentModalImages.length > 1 && (
              <div className="px-5 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-center gap-2 overflow-x-auto">
                {currentModalImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeImageIndex === idx
                        ? "bg-purple text-white shadow-md shadow-purple/40"
                        : "bg-white/10 text-neutral-300 hover:bg-white/20"
                    }`}
                  >
                    Page {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* High-Res Certificate Viewer Canvas */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/80 min-h-[300px] select-none"
            >
              <img
                src={currentModalImages[activeImageIndex] || activeCertificate.image}
                alt={activeCertificate.title}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10 select-none"
              />
            </div>

            {/* Modal Footer Description */}
            {activeCertificate.description && (
              <div className="p-4 bg-black/50 border-t border-white/10 text-xs text-neutral-300">
                <p className="line-clamp-2">{activeCertificate.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
