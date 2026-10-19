import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export interface ProfileData {
  name: string;
  role: string;
  headline: string;
  bio: string;
  email: string;
  dpImage: string;
  resumeLink: string;
  ctaText: string;
}

export interface NavItem {
  name: string;
  link: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
}

export interface ExperienceItem {
  id: number;
  title: string;
  desc: string;
  thumbnail: string;
  className?: string;
}

export interface SocialMediaItem {
  id: number;
  name?: string;
  img: string;
  href: string;
}

export interface GridItem {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName: string;
  titleClassName: string;
  img: string;
  spareImg: string;
}

export interface CertificateItem {
  id: number;
  title: string;
  subtitle?: string;
  category: "Research Conference" | "Open Source" | "Achievement" | "Other" | string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  image: string;
  pdfUrl?: string;
  additionalImages?: string[];
  description?: string;
}

export interface PortfolioContent {
  profile: ProfileData;
  navItems: NavItem[];
  projects: ProjectItem[];
  workExperience: ExperienceItem[];
  socialMedia: SocialMediaItem[];
  gridItems: GridItem[];
  certificates: CertificateItem[];
  updatedAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio-content.json");

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  profile: {
    name: "PAMIDI LAKSHMI PAVANANJALI",
    role: "PAMIDI LAKSHMI PAVANANJALI",
    headline: "Transforming Concepts into Seamless User Experiences",
    bio: "Hi, I'm Pavananjali, a Web Developer, Open Source, AIML and Robotics Enthusiast.",
    email: "plpanjali05@gmail.com",
    dpImage: "/dp.jpg",
    resumeLink: "https://drive.google.com/file/d/1zY5hGuvC-44b8hQJEn3KXADNNnXyZtI2/view?usp=sharing",
    ctaText: "Show my work",
  },
  navItems: [
    { name: "About", link: "#about" },
    { name: "Resume", link: "https://drive.google.com/file/d/1zY5hGuvC-44b8hQJEn3KXADNNnXyZtI2/view?usp=sharing" },
    { name: "Projects", link: "#projects" },
    { name: "Blogs", link: "https://medium.com/@plpanjali05" },
    { name: "Contact", link: "#contact" },
  ],
  gridItems: [
    {
      id: 1,
      title: "I prioritize client collaboration, fostering open communication",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: "I constantly try to improve",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
    {
      id: 5,
      title: "Currently building a JS Animation library",
      description: "The Inside Scoop",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Do you want to start a project together?",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ],
  projects: [
    {
      id: 1,
      title: "Retro",
      des: "A popular open-source vintage-themed web application and collaborative platform recognized across major open-source programs.",
      img: "/p1.svg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
      link: "https://github.com/Anjaliavv51/Retro",
    },
    {
      id: 2,
      title: "Touch-No-Fire-Game",
      des: "An interactive web-based mini-game where players navigate obstacles and score points while avoiding multiplying fire hazards.",
      img: "/p2.svg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg"],
      link: "https://github.com/Anjaliavv51/Touch-No-Fire-Game",
    },
    {
      id: 3,
      title: "apex-data-processor",
      des: "High-performance concurrent data processing service built with Java and Spring Boot with custom thread-safe LRU caching and timeline indexing.",
      img: "/p3.svg",
      iconLists: ["/dock.svg", "/cloud.svg", "/host.svg", "/c.svg"],
      link: "https://github.com/Anjaliavv51/apex-data-processor",
    },
    {
      id: 4,
      title: "TuneCrate",
      des: "A modern music and media exploration application for streaming audio, curating playlists, and discovering creative soundscapes.",
      img: "/p4.svg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg"],
      link: "https://github.com/Anjaliavv51/TuneCrate",
    },
    {
      id: 5,
      title: "MailScribe",
      des: "An intelligent email composition and newsletter tool designed for automated subscriber communications and structured messaging.",
      img: "/p1.svg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/fm.svg"],
      link: "https://github.com/Anjaliavv51/MailScribe",
    },
  ],
  workExperience: [
    {
      id: 1,
      title: "Frontend Engineer Intern",
      desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Mobile App Development",
      desc: "Designed and developed mobile app features for both iOS & Android platforms using React Native.",
      className: "md:col-span-2",
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Open Source & Freelance Projects",
      desc: "Led development of web applications, repository tooling, and automated workflows from initial concept to release.",
      className: "md:col-span-2",
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: "Lead Frontend Developer",
      desc: "Developed and maintained user-facing features using modern frontend technologies.",
      className: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },
  ],
  socialMedia: [
    {
      id: 1,
      name: "GitHub",
      img: "/git.svg",
      href: "https://github.com/Anjaliavv51",
    },
    {
      id: 2,
      name: "Twitter/X",
      img: "/twit.svg",
      href: "https://x.com/Pavananjal75042",
    },
    {
      id: 3,
      name: "LinkedIn",
      img: "/link.svg",
      href: "https://www.linkedin.com/in/lakshmi-pavananjali-pamidi-766760296",
    },
    {
      id: 4,
      name: "Discord",
      img: "/discord.svg",
      href: "https://discordapp.com/users/1179655863926013972",
    },
    {
      "id": 5,
      "name": "Instagram",
      "img": "/insta.svg",
      "href": "https://www.instagram.com/nameits.any",
    },
  ],
  certificates: [
    {
      id: 1,
      title: "A Comprehensive Analysis of Heart Disease Prediction Using Machine Learning Approaches",
      subtitle: "Certificate of Presentation - 4th International Conference on Advanced Communications and Machine Intelligence (MICA 2025)",
      category: "Research Conference",
      issuer: "THE ICFAI UNIVERSITY TRIPURA & Springer",
      issueDate: "December 22-24, 2025",
      image: "/certificates/mica-2025-springer.png",
      pdfUrl: "/certificates/mica-2025-springer.pdf",
      description: "Presented research paper titled 'A Comprehensive Analysis of Heart Disease Prediction Using Machine Learning Approaches' at MICA 2025 organized by ICFAI University Tripura in collaboration with Springer.",
    },
    {
      id: 2,
      title: "DCFG-Net: A Dynamic Cross-Frequency Graph Network for Interpretable EEG Motor Imagery Classification",
      subtitle: "Certificate for Oral Presentation - International Conference on Advanced Design, Materials and Biomedical Engineering (ICDMB 2026)",
      category: "Research Conference",
      issuer: "ANRF & Maulana Azad National Institute of Technology (MANIT), Bhopal",
      issueDate: "October 08-09, 2026",
      credentialId: "Paper ID: 150",
      image: "/certificates/icdmb-2026-manit.png",
      pdfUrl: "/certificates/icdmb-2026-manit.pdf",
      description: "Successfully presented research paper for Oral Presentation at ICDMB 2026 held at MANIT Bhopal, sponsored by ANRF.",
    },
    {
      id: 3,
      title: "GirlScript Summer of Code 2024 - Top Contributor & Top Performer",
      subtitle: "Certificate of Appreciation & GSSoC'24 Top Performer Achievements",
      category: "Open Source",
      issuer: "GirlScript Foundation",
      issueDate: "August 2024",
      credentialId: "GSSoC2024_OST100C_6A152B3C",
      image: "/certificates/gssoc-2024-open-source-p1.png",
      additionalImages: [
        "/certificates/gssoc-2024-open-source-p2.png",
        "/certificates/gssoc-2024-open-source-p3.png",
      ],
      pdfUrl: "/certificates/gssoc-2024-open-source.pdf",
      description: "Designated as Top Performer / Top Contributor at GirlScript Summer of Code 2024 with 93 Pull Requests merged, Rank 18, and 8 achievement badges across multiple open-source repositories.",
    },
    {
      id: 4,
      title: "The Best Photograph Challenge - Certificate of Excellence",
      subtitle: "Secured 2nd Place in both Structures and Macro Photography Categories",
      category: "Creative & Arts",
      issuer: "Drśya, the Multimedia Club of Amrita Vishwa Vidyapeetham",
      issueDate: "Certificate of Excellence",
      image: "/certificates/drsya-photography-excellence.png",
      pdfUrl: "/certificates/drsya-photography-excellence.pdf",
      description: "Secured 2nd Place in both Structures and Macro Photography categories in The Best Photograph Challenge organized by Drśya, the Multimedia Club of Amrita Vishwa Vidyapeetham. 'Keep capturing. Keep creating.'",
    },
  ],
  updatedAt: new Date().toISOString(),
};

/**
 * Read portfolio content from persistent file, initializing with defaults if missing
 */
export function getPortfolioContent(): PortfolioContent {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure all required fields exist
      return {
        ...DEFAULT_PORTFOLIO_CONTENT,
        ...parsed,
        profile: { ...DEFAULT_PORTFOLIO_CONTENT.profile, ...(parsed.profile || {}) },
        certificates: parsed.certificates || DEFAULT_PORTFOLIO_CONTENT.certificates,
      };
    }
  } catch (err) {
    console.error("Error reading portfolio data file:", err);
  }

  // Initialize data file on first run
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_PORTFOLIO_CONTENT, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing initial portfolio content:", err);
  }

  return DEFAULT_PORTFOLIO_CONTENT;
}

/**
 * Save updated portfolio content atomically and revalidate public route
 */
export function savePortfolioContent(newContent: Partial<PortfolioContent>): { success: boolean; error?: string } {
  try {
    const current = getPortfolioContent();
    const updated: PortfolioContent = {
      ...current,
      ...newContent,
      profile: {
        ...current.profile,
        ...(newContent.profile || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    // Keep navItems resume link in sync with profile resume link
    if (updated.profile.resumeLink) {
      updated.navItems = updated.navItems.map((item) =>
        item.name.toLowerCase() === "resume" ? { ...item, link: updated.profile.resumeLink } : item
      );
    }

    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Atomic write
    const tempPath = `${DATA_FILE_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(updated, null, 2), "utf-8");
    fs.renameSync(tempPath, DATA_FILE_PATH);

    // Revalidate public portfolio cache
    try {
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/certificates");
    } catch {
      // ignore outside request context
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save portfolio content";
    console.error("Failed to save portfolio content:", err);
    return { success: false, error: message };
  }
}
