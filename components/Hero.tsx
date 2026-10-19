/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./MagicButton";
import {
  FaLocationArrow,
  FaAward,
  FaComments,
  FaBrain,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaDiscord,
  FaEnvelope,
  FaXmark,
  FaArrowRight,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { BackgroundLines } from "./ui/background-lines";
import { ProfileData } from "@/lib/portfolio-data";

interface HeroProps {
  data?: ProfileData;
}

const Hero = ({ data }: HeroProps) => {
  const name = data?.name || "PAMIDI LAKSHMI PAVANANJALI";
  const headline =
    data?.headline || "Transforming Concepts into Seamless User Experiences";
  const bio =
    data?.bio ||
    "Hi, I'm Pavananjali, a Web Developer, Open Source, AIML and Robotics Enthusiast.";
  const dpImage = data?.dpImage || "/dp.jpg";
  const ctaText = data?.ctaText || "Show my work";

  const [isNlpOpen, setIsNlpOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNlpOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const socialLinks = [
    {
      name: "Instagram",
      handle: "@nameits.any",
      desc: "DM on Instagram for Video Editing, Photography & Creative Inquiries",
      url: "https://www.instagram.com/nameits.any",
      icon: <FaInstagram className="text-xl text-pink-400" />,
      badge: "DM Here",
      color: "hover:border-pink-500/50 hover:bg-pink-500/10",
    },
    {
      name: "LinkedIn",
      handle: "Lakshmi Pavananjali Pamidi",
      desc: "Professional research & technical discussions",
      url: "https://www.linkedin.com/in/lakshmi-pavananjali-pamidi-766760296",
      icon: <FaLinkedin className="text-xl text-blue-400" />,
      badge: "Connect",
      color: "hover:border-blue-500/50 hover:bg-blue-500/10",
    },
    {
      name: "Twitter / X",
      handle: "@Pavananjal75042",
      desc: "AI research trends, tweets & thoughts",
      url: "https://x.com/Pavananjal75042",
      icon: <FaXTwitter className="text-xl text-white" />,
      badge: "Follow",
      color: "hover:border-white/50 hover:bg-white/10",
    },
    {
      name: "Discord",
      handle: "Anjaliavv51",
      desc: "Real-time discussions & community chat",
      url: "https://discordapp.com/users/1179655863926013972",
      icon: <FaDiscord className="text-xl text-indigo-400" />,
      badge: "Chat",
      color: "hover:border-indigo-500/50 hover:bg-indigo-500/10",
    },
    {
      name: "Direct Email",
      handle: "plpanjali05@gmail.com",
      desc: "Detailed inquiries, paper citations & collaborations",
      url: "mailto:plpanjali05@gmail.com?subject=Question%20about%20NLP%20%26%20AI&body=Hi%20Pavananjali,%0A%0AI%20saw%20your%20portfolio%20and%20would%20love%20to%20ask%20you%20about%20NLP:%0A%0A",
      icon: <FaEnvelope className="text-xl text-purple" />,
      badge: "Email",
      color: "hover:border-purple/50 hover:bg-purple/10",
    },
  ];

  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div
        className="h-screen w-full dark:bg-black-100 bg-white  
        dark:bg-grid-white/[0.1] bg-grid-black/[0.2]
        flex items-center justify-center absolute top-0 left-0"
      >
        <div
          className="absolute pointer-events-none inset-0 
          flex items-center justify-center dark:bg-black-100 
          bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div
          className="max-w-[89vw] md:max-w-2xl
        lg:max-w-[60vw] flex flex-col items-center
        justify-center"
        >
          <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <img
              src={dpImage}
              alt="profile-pic"
              className="rounded-full w-80 h-80 border-2 border-white-100 mb-5 object-cover"
            />
            <h1
              className="uppercase tracking-widest
            text-xs text-center text-blue-100 max-w-80"
            >
              {name}
            </h1>
            <TextGenerateEffect
              className="text-center text-[80px] md:text-5xl lg:text-6xl"
              words={headline}
            />
            <p
              className="text-center md:tracking-wider
            mb-4 text-sm md:text-lg lg:text-2xl"
            >
              {bio}
            </p>

            {/* "Ask anything about NLP" Attractive Glowing Feature Banner */}
            <div className="my-5 w-full flex justify-center">
              <button
                onClick={() => setIsNlpOpen(true)}
                className="relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden group focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(203,172,249,0.35)]"
                title="Click to ask Pavananjali anything about Natural Language Processing & AI"
              >
                {/* Animated Rotating Gradient Border */}
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

                {/* Inner Pill Content */}
                <span className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#0d102d] via-[#13163e] to-[#0d102d] border border-white/20 backdrop-blur-3xl text-white text-xs sm:text-sm font-semibold tracking-wide">
                  {/* Glowing Brain Icon with Ping */}
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>

                  <FaBrain className="text-purple text-base sm:text-lg animate-pulse" />

                  <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent font-bold">
                    Ask me anything about NLP
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple/20 text-purple text-[10px] uppercase font-bold border border-purple/30">
                    <FaComments className="text-[10px]" /> Click
                  </span>

                  <FaArrowRight className="text-xs text-purple group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Existing Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-1">
              <a href="#about">
                <MagicButton
                  title={ctaText}
                  icon={<FaLocationArrow />}
                  position={"right"}
                />
              </a>
              <a href="/certificates">
                <MagicButton
                  title="View Certificates"
                  icon={<FaAward className="text-yellow-400 text-lg" />}
                  position={"left"}
                  otherClasses="!bg-[#0c0f24] hover:!bg-[#151c42] border border-purple/30"
                />
              </a>
            </div>
          </BackgroundLines>
        </div>
      </div>

      {/* "Ask Anything About NLP" Interactive Social Modal */}
      {isNlpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6"
        >
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsNlpOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-[#0c102a] border border-purple/40 rounded-3xl shadow-[0_0_50px_rgba(203,172,249,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-b from-purple/10 to-transparent flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple/20 border border-purple/40 flex items-center justify-center text-purple text-2xl shadow-[0_0_20px_rgba(203,172,249,0.4)] shrink-0">
                  <FaBrain />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active & Open for Discussions
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                    Ask Me Anything About <span className="text-purple">NLP</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg leading-relaxed">
                    Have questions about Natural Language Processing, Transformers,
                    EEG Motor Imagery, Heart Disease ML models, or open-source? Pick
                    your favorite platform to reach out:
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNlpOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close modal"
              >
                <FaXmark className="text-base" />
              </button>
            </div>

            {/* Social Channels List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black-200/80 border border-white/10 ${soc.color} transition-all duration-200 group cursor-pointer`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {soc.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-purple transition-colors">
                          {soc.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/[0.08] text-neutral-300 border border-white/10">
                          {soc.handle}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {soc.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-semibold text-purple hidden sm:inline">
                      {soc.badge}
                    </span>
                    <FaArrowUpRightFromSquare className="text-xs text-neutral-400 group-hover:text-purple group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </a>
              ))}

              {/* Sample NLP Topic Starters */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Sample Topics to Ask About:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Attention is All You Need",
                    "Encoder-Decoder",
                    "GPT",
                    "BERT",
                    "LSTM",
                    "RNN",
                    "GRU",
                    "Transformer Attention Mechanisms",
                    "EEG Cross-Frequency Graph Networks",
                    "Heart Disease Machine Learning",
                    "GSSoC Open Source Contributions",
                    "Fine-Tuning LLMs & Prompt Engineering",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-purple/40 hover:bg-purple/10 transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>Typically replies within a few hours</span>
              <button
                onClick={() => setIsNlpOpen(false)}
                className="text-purple hover:underline font-medium cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;