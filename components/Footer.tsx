/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaLocationArrow, FaInstagram } from "react-icons/fa6";
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
          <a
            href="https://www.instagram.com/nameits.any"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MagicButton
              title="DM on Instagram"
              icon={<FaInstagram className="text-pink-400 text-lg" />}
              position="left"
              otherClasses="!bg-[#150a24] hover:!bg-[#220d3a] border border-pink-500/30 text-white"
            />
          </a>
        </div>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="md:text-base text-sm md:font-normal font-light">
            Copyright © {new Date().getFullYear()} Pavananjali
          </p>
          <Link
            href="/admin"
            className="text-xs text-white-200/40 hover:text-white-200 transition-colors ml-1"
            title="Admin Login"
          >
            • Admin
          </Link>
        </div>

        <div className="flex items-center md:gap-3 gap-6">
          {displaySocial.map((info) => {
            let href = info.href || "#";
            if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("mailto:")) {
              href = `https://${href}`;
            }

            const itemLabel = ("name" in info && info.name) ? info.name : "Social profile";

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
                    src={info.img}
                    alt={itemLabel}
                    width={20}
                    height={20}
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