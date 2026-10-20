/* eslint-disable @next/next/no-img-element */
import { FaLocationArrow, FaInstagram, FaArrowRight } from "react-icons/fa6";
import { socialMedia as defaultSocialMedia } from "@/data";
import MagicButton from "./MagicButton";
import { SocialMediaItem } from "@/lib/portfolio-data";

interface FooterProps {
  email?: string;
  socialMedia?: SocialMediaItem[];
}

const Footer = ({ email, socialMedia }: FooterProps) => {
  const displayEmail = email || "plpanjali05@gmail.com";
  const displaySocial =
    socialMedia && socialMedia.length > 0 ? socialMedia : defaultSocialMedia;

  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96 pointer-events-none">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={`mailto:${displayEmail}`}>
            <MagicButton
              title="Let's get in touch"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>

          {/* Cool & Stylish Instagram Button with Animated Gradient & Hover Reveal */}
          <div className="relative group md:mt-10">
            {/* Stylish Floating Glassmorphism Tooltip on Hover */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none transition-all duration-300 ease-out z-30 whitespace-nowrap">
              <div className="relative px-3.5 py-1.5 rounded-xl bg-[#190a28]/95 border border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.45)] backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <span className="text-xs font-semibold bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
                  DM on Instagram for Video Editing and Photography
                </span>
                {/* Tooltip bottom pointer */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#190a28] border-r border-b border-pink-500/50 rotate-45" />
              </div>
            </div>

            <a
              href="https://www.instagram.com/nameits.any"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1.5px] focus:outline-none transition-all duration-300 group-hover:scale-[1.02] shadow-[0_0_20px_rgba(236,72,153,0.2)] group-hover:shadow-[0_0_35px_rgba(236,72,153,0.45)]"
            >
              {/* Animated Instagram Multi-Color Conic Gradient Border */}
              <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] opacity-80 group-hover:opacity-100 transition-opacity" />

              <span className="relative inline-flex h-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-[#0d0714] via-[#160a22] to-[#0d0714] px-6 text-sm font-medium text-white backdrop-blur-3xl gap-2.5 border border-white/10 group-hover:border-pink-500/40 transition-colors">
                <FaInstagram className="text-pink-400 text-lg shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                
                {/* Dynamic Text Switching / Expanding on Hover */}
                <span className="relative inline-flex items-center">
                  <span className="inline-block transition-all duration-300 group-hover:hidden">
                    DM on Instagram
                  </span>
                  <span className="hidden group-hover:inline-block transition-all duration-300 bg-gradient-to-r from-pink-200 via-purple-100 to-amber-200 bg-clip-text text-transparent font-semibold">
                    DM on Instagram for Video Editing and Photography
                  </span>
                </span>

                <FaArrowRight className="text-xs text-pink-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="md:text-base text-sm md:font-normal font-light">
            Copyright © {new Date().getFullYear()} Pavananjali
          </p>
          <a
            href="/admin"
            className="text-xs text-neutral-400 hover:text-purple transition-colors ml-1 font-medium"
            title="Admin Login"
          >
            • Admin
          </a>
        </div>

        <div className="flex items-center md:gap-3 gap-6">
          {displaySocial.map((info) => {
            let href = info.href || "#";
            if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("mailto:")) {
              href = `https://${href}`;
            }

            const itemLabel = ("name" in info && info.name) ? info.name : "Social profile";
            const isInstagram = itemLabel.toLowerCase().includes("instagram") || (info.img && info.img.includes("insta"));
            const imgSrc = isInstagram ? "/insta.svg" : (info.img || "/git.svg");

            return (
              <div
                key={info.id}
                className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 transition-all hover:scale-110"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={itemLabel}
                >
                  <img
                    src={imgSrc}
                    alt={itemLabel}
                    width={20}
                    height={20}
                    onError={(e) => {
                      if (isInstagram) {
                        e.currentTarget.src = "/insta.svg";
                      }
                    }}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;