"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PortfolioContent,
  ProjectItem,
  ExperienceItem,
  CertificateItem,
} from "@/lib/portfolio-data";
import {
  FaArrowUpRightFromSquare,
  FaRightFromBracket,
  FaFloppyDisk,
  FaUserGear,
  FaFolderOpen,
  FaBriefcase,
  FaShareNodes,
  FaTableCellsLarge,
  FaPlus,
  FaTrashCan,
  FaPenToSquare,
  FaUpload,
  FaTriangleExclamation,
  FaCircleCheck,
  FaAward,
  FaFilePdf,
  FaEye,
} from "react-icons/fa6";

interface AdminDashboardClientProps {
  initialContent: PortfolioContent;
  username: string;
}

export default function AdminDashboardClient({
  initialContent,
  username,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<PortfolioContent>(initialContent);
  const [activeTab, setActiveTab] = useState<
    "profile" | "projects" | "experience" | "certificates" | "social" | "bento"
  >("profile");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Modal states for Projects, Experience & Certificates
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceItem | null>(null);
  const [isNewExperience, setIsNewExperience] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<CertificateItem | null>(null);
  const [isNewCertificate, setIsNewCertificate] = useState(false);

  // File input ref for generic uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    type:
      | "profile"
      | "project"
      | "experience"
      | "certificate-image"
      | "certificate-pdf";
    id?: number | string;
  } | null>(null);

  // Handle Logout
  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    }
  }

  // Save all changes to the backend
  async function handleSave(updatedContent?: PortfolioContent) {
    const toSave = updatedContent || content;
    if (!toSave) return;

    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save operation failed");
      }

      setContent(data.content);
      setStatusMessage({
        type: "success",
        text: "Portfolio updated successfully! Changes are now live on your public website.",
      });

      // Clear success notification after 5 seconds
      setTimeout(() => {
        setStatusMessage((curr) => (curr?.type === "success" ? null : curr));
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while saving";
      setStatusMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  }

  // Handle Image Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget || !content) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingField("active");
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      const uploadedUrl = data.url;

      if (uploadTarget.type === "profile") {
        const updated = {
          ...content,
          profile: { ...content.profile, dpImage: uploadedUrl },
        };
        setContent(updated);
        handleSave(updated);
      } else if (uploadTarget.type === "project" && editingProject) {
        setEditingProject({ ...editingProject, img: uploadedUrl });
      } else if (uploadTarget.type === "experience" && editingExperience) {
        setEditingExperience({ ...editingExperience, thumbnail: uploadedUrl });
      } else if (
        uploadTarget.type === "certificate-image" &&
        editingCertificate
      ) {
        setEditingCertificate({ ...editingCertificate, image: uploadedUrl });
      } else if (
        uploadTarget.type === "certificate-pdf" &&
        editingCertificate
      ) {
        setEditingCertificate({ ...editingCertificate, pdfUrl: uploadedUrl });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(msg);
    } finally {
      setUploadingField(null);
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function triggerUpload(
    type:
      | "profile"
      | "project"
      | "experience"
      | "certificate-image"
      | "certificate-pdf",
    id?: number | string
  ) {
    setUploadTarget({ type, id });
    fileInputRef.current?.click();
  }

  return (
    <div className="min-h-screen bg-black-100 text-white flex flex-col">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf"
        className="hidden"
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black-100/90 backdrop-blur-xl border-b border-white/[0.1] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple/20 border border-purple/40 flex items-center justify-center text-purple text-sm font-bold shadow-[0_0_15px_rgba(203,172,249,0.3)]">
            P
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Portfolio Admin
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple/20 text-purple border border-purple/30 font-medium">
                Live
              </span>
            </h1>
            <p className="text-xs text-white-200 hidden sm:block">
              Logged in as <span className="text-white">{username}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Live Site Button */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.15] bg-black-200 text-xs font-medium text-white-100 hover:text-white hover:border-purple/50 transition-colors"
          >
            <span>View Site</span>
            <FaArrowUpRightFromSquare className="text-[10px]" />
          </Link>

          {/* Save Button */}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-purple text-black text-xs font-semibold hover:bg-purple/90 transition-all shadow-[0_0_20px_rgba(203,172,249,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaFloppyDisk />
            )}
            <span>{saving ? "Publishing..." : "Save Changes"}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg text-white-200 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <FaRightFromBracket className="text-sm" />
          </button>
        </div>
      </header>

      {/* Global Status Notification */}
      {statusMessage && (
        <div
          className={`px-4 py-2.5 text-xs font-medium flex items-center justify-between z-30 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border-b border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {statusMessage.type === "success" ? (
              <FaCircleCheck className="text-sm shrink-0" />
            ) : (
              <FaTriangleExclamation className="text-sm shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Admin Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1.5 p-2 rounded-2xl bg-black-200 border border-white/[0.1] backdrop-blur-xl sticky top-20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaUserGear className="text-base" />
              <span>Profile & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaFolderOpen className="text-base" />
              <span>Projects</span>
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "projects"
                    ? "bg-black/20 text-black"
                    : "bg-white/[0.1] text-white-100"
                }`}
              >
                {content.projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("experience")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "experience"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaBriefcase className="text-base" />
              <span>Work Experience</span>
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "experience"
                    ? "bg-black/20 text-black"
                    : "bg-white/[0.1] text-white-100"
                }`}
              >
                {content.workExperience.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaAward className="text-base" />
              <span>Certificates</span>
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "certificates"
                    ? "bg-black/20 text-black"
                    : "bg-white/[0.1] text-white-100"
                }`}
              >
                {(content.certificates || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("social")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "social"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaShareNodes className="text-base" />
              <span>Social Links</span>
            </button>

            <button
              onClick={() => setActiveTab("bento")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "bento"
                  ? "bg-purple text-black shadow-[0_0_15px_rgba(203,172,249,0.3)] font-semibold"
                  : "text-white-100 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <FaTableCellsLarge className="text-base" />
              <span>Bento Grid Cards</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: Profile & Hero */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black-200 border border-white/[0.1]">
                <h2 className="text-lg font-bold text-white mb-1">
                  Hero Section & Identity
                </h2>
                <p className="text-xs text-white-100 mb-6">
                  Manage your header title, bio, profile photo, and resume link.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/[0.08]">
                  {/* Profile Picture Uploader */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black-100/50 border border-white/[0.08] text-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple shadow-[0_0_20px_rgba(203,172,249,0.2)] mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={content.profile.dpImage || "/dp.jpg"}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerUpload("profile")}
                      disabled={uploadingField === "active"}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FaUpload className="text-[10px]" />
                      <span>
                        {uploadingField === "active"
                          ? "Uploading..."
                          : "Upload New Photo"}
                      </span>
                    </button>
                    <p className="text-[10px] text-white-200 mt-2">
                      PNG, JPG, or WebP. Max 10MB.
                    </p>
                  </div>

                  {/* Primary Profile Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white-100 uppercase tracking-wider mb-1.5">
                        Full Name / Small Heading
                      </label>
                      <input
                        type="text"
                        value={content.profile.name}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            profile: { ...content.profile, name: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white-100 uppercase tracking-wider mb-1.5">
                        Dynamic Headline (TextGenerateEffect)
                      </label>
                      <input
                        type="text"
                        value={content.profile.headline}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            profile: {
                              ...content.profile,
                              headline: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white-100 uppercase tracking-wider mb-1.5">
                        Contact / Notification Email
                      </label>
                      <input
                        type="email"
                        value={content.profile.email}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            profile: {
                              ...content.profile,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-purple"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white-100 uppercase tracking-wider mb-1.5">
                      Bio Subtitle
                    </label>
                    <textarea
                      rows={3}
                      value={content.profile.bio}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: { ...content.profile, bio: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-purple resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white-100 uppercase tracking-wider mb-1.5">
                      Google Drive Resume Link
                    </label>
                    <input
                      type="url"
                      value={content.profile.resumeLink}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            resumeLink: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-purple"
                    />
                    <p className="text-[11px] text-white-200 mt-1">
                      Updating this automatically updates the Floating Navbar link
                      and Bento Grid Resume button.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Projects Management */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                  <p className="text-xs text-white-100">
                    Add, edit, or delete items displayed in the &quot;Recent Projects&quot; section.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: Date.now(),
                      title: "",
                      des: "",
                      img: "/p1.svg",
                      iconLists: ["/next.svg", "/tail.svg", "/ts.svg"],
                      link: "https://github.com/Anjaliavv51",
                    });
                    setIsNewProject(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple text-black text-xs font-semibold hover:bg-purple/90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(203,172,249,0.3)] cursor-pointer"
                >
                  <FaPlus />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-black-200 border border-white/[0.1] flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#13162D] mb-4 border border-white/[0.05]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.img || "/bg.png"}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-base font-bold text-white line-clamp-1 mb-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-white-100 line-clamp-2 mb-3">
                        {proj.des}
                      </p>
                      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                        {proj.iconLists?.map((icon, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-black-100 border border-white/[0.1] text-white-200 font-mono"
                          >
                            {icon.replace("/", "").replace(".svg", "")}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-purple hover:underline flex items-center gap-1"
                      >
                        <span>Visit Link</span>
                        <FaArrowUpRightFromSquare className="text-[10px]" />
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsNewProject(false);
                          }}
                          className="p-1.5 rounded-lg text-white-100 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <FaPenToSquare className="text-xs" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to remove "${proj.title}"?`
                              )
                            ) {
                              const updated = {
                                ...content,
                                projects: content.projects.filter(
                                  (p) => p.id !== proj.id
                                ),
                              };
                              setContent(updated);
                              handleSave(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg text-white-100 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <FaTrashCan className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Work Experience Management */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Work Experience</h2>
                  <p className="text-xs text-white-100">
                    Manage the moving border cards under &quot;My work experience&quot;.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingExperience({
                      id: Date.now(),
                      title: "",
                      desc: "",
                      thumbnail: "/exp1.svg",
                      className: "md:col-span-2",
                    });
                    setIsNewExperience(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple text-black text-xs font-semibold hover:bg-purple/90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(203,172,249,0.3)] cursor-pointer"
                >
                  <FaPlus />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3">
                {content.workExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-black-200 border border-white/[0.1] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-black-100 p-2 shrink-0 border border-white/[0.08]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={exp.thumbnail}
                          alt={exp.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {exp.title}
                        </h4>
                        <p className="text-xs text-white-100 line-clamp-1">
                          {exp.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingExperience(exp);
                          setIsNewExperience(false);
                        }}
                        className="p-2 rounded-lg text-white-100 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                        title="Edit Experience"
                      >
                        <FaPenToSquare className="text-xs" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to remove "${exp.title}"?`
                            )
                          ) {
                            const updated = {
                              ...content,
                              workExperience: content.workExperience.filter(
                                (e) => e.id !== exp.id
                              ),
                            };
                            setContent(updated);
                            handleSave(updated);
                          }
                        }}
                        className="p-2 rounded-lg text-white-100 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Experience"
                      >
                        <FaTrashCan className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3.5: Certificates & Publications */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black-200 border border-white/[0.1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Certificates & Credentials
                  </h2>
                  <p className="text-xs text-white-100">
                    Manage research paper presentations, conference publications, and open-source contributor awards.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/certificates"
                    target="_blank"
                    className="px-3 py-2 rounded-xl border border-white/[0.15] bg-black-100 text-white-100 text-xs font-semibold hover:text-white hover:border-purple transition-all flex items-center gap-1.5"
                  >
                    <FaArrowUpRightFromSquare className="text-[10px]" />
                    <span>View Public Page</span>
                  </Link>
                  <button
                    onClick={() => {
                      setEditingCertificate({
                        id: Date.now(),
                        title: "",
                        issuer: "",
                        issueDate: new Date().toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        }),
                        category: "Research Conference",
                        description: "",
                        image: "/certificates/mica-2025-springer.png",
                        pdfUrl: "/certificates/mica-2025-springer.pdf",
                        credentialId: "",
                      });
                      setIsNewCertificate(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple text-black text-xs font-semibold hover:bg-purple/90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(203,172,249,0.3)] cursor-pointer"
                  >
                    <FaPlus />
                    <span>Add Certificate</span>
                  </button>
                </div>
              </div>

              {/* Certificates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content.certificates || []).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-black-200 border border-white/[0.1] flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black-100 mb-4 border border-white/[0.08] group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-purple border border-purple/30">
                            {cert.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white-200 mb-1">
                        <span className="font-medium text-purple">{cert.issuer}</span>
                        <span>{cert.issueDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-2 mb-2">
                        {cert.title}
                      </h3>

                      <p className="text-xs text-white-100 line-clamp-3 mb-3">
                        {cert.description}
                      </p>

                      {cert.credentialId && (
                        <div className="text-[11px] text-white-200 font-mono bg-black-100/80 px-2 py-1 rounded border border-white/[0.06] mb-3 inline-block">
                          ID: {cert.credentialId}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cert.pdfUrl && (
                          <a
                            href={cert.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-purple hover:underline flex items-center gap-1 font-medium"
                          >
                            <FaFilePdf className="text-xs" />
                            <span>PDF</span>
                          </a>
                        )}
                        <a
                          href={cert.image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-white-100 hover:text-white flex items-center gap-1 font-medium"
                        >
                          <FaEye className="text-xs" />
                          <span>Image</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCertificate(cert);
                            setIsNewCertificate(false);
                          }}
                          className="p-1.5 rounded-lg text-white-100 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                          title="Edit Certificate"
                        >
                          <FaPenToSquare className="text-xs" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to remove "${cert.title}"?`
                              )
                            ) {
                              const updated = {
                                ...content,
                                certificates: (content.certificates || []).filter(
                                  (c) => c.id !== cert.id
                                ),
                              };
                              setContent(updated);
                              handleSave(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg text-white-100 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Certificate"
                        >
                          <FaTrashCan className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Social Media Links */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black-200 border border-white/[0.1]">
                <h2 className="text-lg font-bold text-white mb-1">Social Profiles</h2>
                <p className="text-xs text-white-100 mb-6">
                  Manage the social media links displayed in the portfolio footer.
                </p>

                <div className="space-y-4">
                  {content.socialMedia.map((soc, idx) => (
                    <div
                      key={soc.id || idx}
                      className="p-4 rounded-xl bg-black-100/60 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-black-200 border border-white/[0.1] flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={soc.img}
                          alt={soc.name || "icon"}
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-white-200 uppercase tracking-wider mb-1">
                          {soc.name || `Social Link #${idx + 1}`}
                        </label>
                        <input
                          type="text"
                          value={soc.href}
                          onChange={(e) => {
                            const updatedList = [...content.socialMedia];
                            updatedList[idx] = {
                              ...updatedList[idx],
                              href: e.target.value,
                            };
                            setContent({ ...content, socialMedia: updatedList });
                          }}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-purple"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Bento Grid */}
          {activeTab === "bento" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black-200 border border-white/[0.1]">
                <h2 className="text-lg font-bold text-white mb-1">
                  Bento Grid Cards Content
                </h2>
                <p className="text-xs text-white-100 mb-6">
                  Fine-tune the titles and descriptions of the Bento Grid interactive blocks.
                </p>

                <div className="space-y-4">
                  {content.gridItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-black-100/60 border border-white/[0.08] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple uppercase">
                          Card #{item.id}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-white-200 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updatedGrid = [...content.gridItems];
                            updatedGrid[idx] = {
                              ...updatedGrid[idx],
                              title: e.target.value,
                            };
                            setContent({ ...content, gridItems: updatedGrid });
                          }}
                          className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-purple"
                        />
                      </div>
                      {item.description !== undefined && (
                        <div>
                          <label className="block text-[11px] text-white-200 mb-1">
                            Description / Subtitle
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updatedGrid = [...content.gridItems];
                              updatedGrid[idx] = {
                                ...updatedGrid[idx],
                                description: e.target.value,
                              };
                              setContent({ ...content, gridItems: updatedGrid });
                            }}
                            className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-purple"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit / Add Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-black-200 border border-white/[0.15] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {isNewProject ? "Add New Project" : "Edit Project"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingProject.des}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, des: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Project Link (GitHub or Live URL)
              </label>
              <input
                type="url"
                value={editingProject.link}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, link: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Cover Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingProject.img}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, img: e.target.value })
                  }
                  className="flex-1 px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => triggerUpload("project", editingProject.id)}
                  className="px-3 py-2 bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <FaUpload />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Tech Icons (comma-separated, e.g. /next.svg, /ts.svg, /tail.svg)
              </label>
              <input
                type="text"
                value={editingProject.iconLists?.join(", ") || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    iconLists: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="pt-4 border-t border-white/[0.1] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-lg text-white-100 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingProject.title.trim()) {
                    alert("Please provide a project title");
                    return;
                  }
                  let updatedProjects: ProjectItem[];
                  if (isNewProject) {
                    updatedProjects = [editingProject, ...content.projects];
                  } else {
                    updatedProjects = content.projects.map((p) =>
                      p.id === editingProject.id ? editingProject : p
                    );
                  }
                  const updated = { ...content, projects: updatedProjects };
                  setContent(updated);
                  setEditingProject(null);
                  handleSave(updated);
                }}
                className="px-5 py-2 rounded-lg bg-purple text-black text-xs font-bold hover:bg-purple/90 cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Experience Modal */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-black-200 border border-white/[0.15] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {isNewExperience ? "Add Work Experience" : "Edit Experience"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={editingExperience.title}
                onChange={(e) =>
                  setEditingExperience({
                    ...editingExperience,
                    title: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingExperience.desc}
                onChange={(e) =>
                  setEditingExperience({
                    ...editingExperience,
                    desc: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Thumbnail Icon URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingExperience.thumbnail}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      thumbnail: e.target.value,
                    })
                  }
                  className="flex-1 px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    triggerUpload("experience", editingExperience.id)
                  }
                  className="px-3 py-2 bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <FaUpload />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.1] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingExperience(null)}
                className="px-4 py-2 rounded-lg text-white-100 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingExperience.title.trim()) {
                    alert("Please provide a title");
                    return;
                  }
                  let updatedList: ExperienceItem[];
                  if (isNewExperience) {
                    updatedList = [editingExperience, ...content.workExperience];
                  } else {
                    updatedList = content.workExperience.map((e) =>
                      e.id === editingExperience.id ? editingExperience : e
                    );
                  }
                  const updated = { ...content, workExperience: updatedList };
                  setContent(updated);
                  setEditingExperience(null);
                  handleSave(updated);
                }}
                className="px-5 py-2 rounded-lg bg-purple text-black text-xs font-bold hover:bg-purple/90 cursor-pointer"
              >
                Save Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Certificate Modal */}
      {editingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-black-200 border border-white/[0.15] p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">
              {isNewCertificate ? "Add Certificate" : "Edit Certificate"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Certificate Title / Paper Title
              </label>
              <input
                type="text"
                value={editingCertificate.title}
                onChange={(e) =>
                  setEditingCertificate({
                    ...editingCertificate,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. MICA 2025 Research Presentation"
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                  Issuer / Organization
                </label>
                <input
                  type="text"
                  value={editingCertificate.issuer}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      issuer: e.target.value,
                    })
                  }
                  placeholder="e.g. ICFAI University & Springer"
                  className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                  Issue Date / Conference Date
                </label>
                <input
                  type="text"
                  value={editingCertificate.issueDate}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      issueDate: e.target.value,
                    })
                  }
                  placeholder="e.g. Dec 2025 or Oct 2026"
                  className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                  Category
                </label>
                <select
                  value={editingCertificate.category}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      category: e.target.value as CertificateItem["category"],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm focus:outline-none"
                >
                  <option value="Research Conference">Research Conference</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Course / Specialization">
                    Course / Specialization
                  </option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                  Credential ID / Paper ID (Optional)
                </label>
                <input
                  type="text"
                  value={editingCertificate.credentialId || ""}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      credentialId: e.target.value,
                    })
                  }
                  placeholder="e.g. Paper ID: 150 or Cert ID"
                  className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Description & Highlights
              </label>
              <textarea
                rows={3}
                value={editingCertificate.description}
                onChange={(e) =>
                  setEditingCertificate({
                    ...editingCertificate,
                    description: e.target.value,
                  })
                }
                placeholder="Details of the paper, topic, achievement, badges, or ranking..."
                className="w-full px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm resize-none"
              />
            </div>

            {/* Certificate Preview Image URL & Upload */}
            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Certificate Preview Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingCertificate.image}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      image: e.target.value,
                    })
                  }
                  placeholder="/certificates/... or uploaded URL"
                  className="flex-1 px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    triggerUpload("certificate-image", editingCertificate.id)
                  }
                  className="px-3 py-2 bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FaUpload />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {/* Certificate PDF URL & Upload */}
            <div>
              <label className="block text-xs font-semibold text-white-100 uppercase mb-1">
                Certificate PDF Document URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingCertificate.pdfUrl || ""}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      pdfUrl: e.target.value,
                    })
                  }
                  placeholder="/certificates/....pdf or uploaded URL"
                  className="flex-1 px-3.5 py-2 rounded-lg bg-black-100 border border-white/[0.1] text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    triggerUpload("certificate-pdf", editingCertificate.id)
                  }
                  className="px-3 py-2 bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FaUpload />
                  <span>Upload PDF</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.1] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCertificate(null)}
                className="px-4 py-2 rounded-lg text-white-100 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingCertificate.title.trim()) {
                    alert("Please provide a certificate title");
                    return;
                  }
                  let updatedList: CertificateItem[];
                  const existingList = content.certificates || [];
                  if (isNewCertificate) {
                    updatedList = [editingCertificate, ...existingList];
                  } else {
                    updatedList = existingList.map((c) =>
                      c.id === editingCertificate.id ? editingCertificate : c
                    );
                  }
                  const updated = { ...content, certificates: updatedList };
                  setContent(updated);
                  setEditingCertificate(null);
                  handleSave(updated);
                }}
                className="px-5 py-2 rounded-lg bg-purple text-black text-xs font-bold hover:bg-purple/90 cursor-pointer"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
