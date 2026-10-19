import fs from "fs";
import path from "path";
import os from "os";
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

export interface PhotographItem {
  id: number;
  title: string;
  category: "Structures" | "Macro" | "Nature" | "Creative" | "Portraits" | string;
  image: string;
  caption?: string;
  award?: string;
  location?: string;
  date?: string;
  featured?: boolean;
}

export interface PortfolioContent {
  profile: ProfileData;
  navItems: NavItem[];
  projects: ProjectItem[];
  workExperience: ExperienceItem[];
  socialMedia: SocialMediaItem[];
  gridItems: GridItem[];
  certificates: CertificateItem[];
  photography: PhotographItem[];
  updatedAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio-content.json");
const TMP_DATA_FILE_PATH = path.join(os.tmpdir(), "portfolio-content.json");

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

// In-memory memory cache for ultra-fast and resilient access across serverless executions
let inMemoryContentCache: PortfolioContent | null = null;

export const DEFAULT_PHOTOGRAPHY: PhotographItem[] = [
  {
    id: 1,
    title: "Structural Elegance & Geometric Symmetry",
    category: "Structures",
    image: "/p1.svg",
    award: "🥈 2nd Place — Structures Photography Category",
    caption: "Secured 2nd Place at Drśya Multimedia Club. Capturing dynamic perspective, architectural rhythms, and precise structural harmony.",
    location: "Campus Architecture",
    featured: true,
  },
  {
    id: 2,
    title: "Macro Organic Patterns & Water Droplets",
    category: "Macro",
    image: "/b1.svg",
    award: "🥈 2nd Place — Macro Photography Category",
    caption: "Secured 2nd Place at Drśya Multimedia Club. Extreme close-up exploring nature's microscopic geometry and light refraction.",
    location: "Botanical Garden",
    featured: true,
  },
  {
    id: 3,
    title: "Luminescence & Urban Lines",
    category: "Structures",
    image: "/b5.svg",
    caption: "Golden hour interplay of illumination, shadows, and metallic geometric lines.",
    location: "Urban Center",
    featured: false,
  },
  {
    id: 4,
    title: "Microscopic Petal Textures",
    category: "Macro",
    image: "/grid.svg",
    caption: "Macro lens detail isolating natural pigments and delicate structural textures.",
    location: "Studio Macro",
    featured: false,
  },
];

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
    { name: "Certificates", link: "/certificates" },
    { name: "Photography", link: "/photography" },
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
      title: "Currently building a project on MI Classification",
      description: "CDHAT-Net",
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
      title: "Heart Disease Prediction System",
      des: "An ML-driven cardiovascular risk assessment tool utilizing ensemble algorithms to predict heart disease likelihood accurately.",
      img: "/p3.svg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
      link: "https://github.com/Anjaliavv51/Heart_disease",
    },
    {
      id: 4,
      title: "Animated Apple Iphone 3D Website",
      des: "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects..",
      img: "/p4.svg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
      link: "https://github.com/Anjaliavv51/3d-portfolio",
    },
  ],
  workExperience: [
    {
      id: 1,
      title: "Video Editor & Content Creator",
      desc: "Creating high-retention video edits, reel sequences, motion graphics, and creative visual assets tailored for social media & brand storytelling. (DM on Instagram for video editing & photography collaborations).",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Open Source Contributor & Maintainer",
      desc: "Actively contributing to open-source ecosystems, reviewing PRs, maintaining frontend repositories, and mentoring community newcomers across global programs.",
      className: "md:col-span-2",
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Full-Stack Web & AI Developer",
      desc: "Designing and developing modern, responsive web applications integrated with intelligent ML backends, Next.js, TypeScript, and Three.js.",
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
      name: "Twitter",
      img: "/twit.svg",
      href: "https://twitter.com",
    },
    {
      id: 3,
      name: "LinkedIn",
      img: "/link.svg",
      href: "https://www.linkedin.com/in/pamidi-lakshmi-pavananjali-912a55257/",
    },
    {
      id: 4,
      name: "Instagram",
      img: "/instagram.svg",
      href: "https://www.instagram.com/nameits.any",
    },
  ],
  certificates: [
    {
      id: 1,
      title: "2024 15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
      subtitle: "IEEE Conference Certificate of Presentation",
      category: "Research Conference",
      issuer: "IEEE & IIT Mandi, Himachal Pradesh, India",
      issueDate: "July 18-20, 2024",
      image: "/certificates/icccnt-2024-presentation.png",
      pdfUrl: "/certificates/icccnt-2024-presentation.pdf",
      description: "Certified that Pamidi Lakshmi Pavananjali presented the research paper titled 'A Novel Deep Learning Framework for EEG Motor Imagery Classification' at the prestigious 15th ICCCNT 2024.",
    },
    {
      id: 2,
      title: "6th International Conference on Inventive Computation Technologies (ICICT 2024)",
      subtitle: "Tribhuvan University, Nepal & Springer / IEEE",
      category: "Research Conference",
      issuer: "Tribhuvan University, Nepal",
      issueDate: "April 24-26, 2024",
      image: "/certificates/icict-2024-presentation.png",
      pdfUrl: "/certificates/icict-2024-presentation.pdf",
      description: "Certificate of Presentation awarded for presenting the research paper titled 'Optimized Machine Learning Architectures for Cardiovascular Risk Stratification' at the 6th ICICT 2024.",
    },
    {
      id: 3,
      title: "GirlScript Summer of Code (GSSoC) 2024 Contributor Certificate",
      subtitle: "Open Source Contributor & Maintainer Recognition",
      category: "Open Source",
      issuer: "GirlScript Foundation India",
      issueDate: "October 2024",
      image: "/certificates/gssoc-2024-contributor.png",
      pdfUrl: "/certificates/gssoc-2024-contributor.pdf",
      description: "Awarded to Pamidi Lakshmi Pavananjali in recognition of outstanding contributions, code commits, and active community engagement in GirlScript Summer of Code 2024.",
    },
    {
      id: 4,
      title: "Drśya Multimedia Club Photography Challenge — 2nd Place",
      subtitle: "Secured Second Place in Both Structures and Macro Categories",
      category: "Achievement",
      issuer: "Drśya - The Multimedia Club of Amrita Vishwa Vidyapeetham",
      issueDate: "Certificate of Excellence",
      image: "/certificates/drsya-photography-excellence.png",
      pdfUrl: "/certificates/drsya-photography-excellence.pdf",
      description: "Secured 2nd Place in both Structures and Macro Photography categories in The Best Photograph Challenge organized by Drśya, the Multimedia Club of Amrita Vishwa Vidyapeetham. 'Keep capturing. Keep creating.'",
    },
  ],
  photography: DEFAULT_PHOTOGRAPHY,
  updatedAt: new Date().toISOString(),
};

/**
 * Read portfolio content from persistent file or serverless /tmp cache, initializing with defaults if missing
 */
export function getPortfolioContent(): PortfolioContent {
  // 0. Return in-memory cache if active
  if (inMemoryContentCache) {
    return inMemoryContentCache;
  }

  // 1. Try reading from TMP_DATA_FILE_PATH first (in-memory/serverless cache updated via admin dashboard)
  try {
    if (fs.existsSync(TMP_DATA_FILE_PATH)) {
      const raw = fs.readFileSync(TMP_DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const result: PortfolioContent = {
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...parsed,
          profile: { ...DEFAULT_PORTFOLIO_CONTENT.profile, ...(parsed.profile || {}) },
          certificates: parsed.certificates || DEFAULT_PORTFOLIO_CONTENT.certificates,
          photography: parsed.photography || DEFAULT_PORTFOLIO_CONTENT.photography || [],
        };
        inMemoryContentCache = result;
        return result;
      }
    }
  } catch (err) {
    console.warn("Could not read from TMP_DATA_FILE_PATH:", err);
  }

  // 2. Try reading from primary project repository data file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      const result: PortfolioContent = {
        ...DEFAULT_PORTFOLIO_CONTENT,
        ...parsed,
        profile: { ...DEFAULT_PORTFOLIO_CONTENT.profile, ...(parsed.profile || {}) },
        certificates: parsed.certificates || DEFAULT_PORTFOLIO_CONTENT.certificates,
        photography: parsed.photography || DEFAULT_PORTFOLIO_CONTENT.photography || [],
      };
      inMemoryContentCache = result;
      return result;
    }
  } catch (err) {
    console.error("Error reading portfolio data file:", err);
  }

  // 3. Initialize data file on first run if writable and not in serverless
  if (!isServerless) {
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_PORTFOLIO_CONTENT, null, 2), "utf-8");
    } catch {
      // Expected in read-only environments
    }
  }

  inMemoryContentCache = DEFAULT_PORTFOLIO_CONTENT;
  return DEFAULT_PORTFOLIO_CONTENT;
}

/**
 * Save updated portfolio content atomically and revalidate public route
 * Gracefully handles read-only serverless environments (Vercel) without triggering EROFS
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
      photography: newContent.photography || current.photography || DEFAULT_PHOTOGRAPHY,
      updatedAt: new Date().toISOString(),
    };

    // Keep navItems resume link in sync with profile resume link
    if (updated.profile.resumeLink) {
      updated.navItems = updated.navItems.map((item) =>
        item.name.toLowerCase() === "resume" ? { ...item, link: updated.profile.resumeLink } : item
      );
    }

    inMemoryContentCache = updated;
    const jsonStr = JSON.stringify(updated, null, 2);

    // 1. Always write to serverless TMP_DATA_FILE_PATH (always writable in AWS Lambda / Vercel Serverless)
    try {
      const tmpTemp = `${TMP_DATA_FILE_PATH}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpTemp, jsonStr, "utf-8");
      fs.renameSync(tmpTemp, TMP_DATA_FILE_PATH);
    } catch (err) {
      console.warn("Could not write to TMP_DATA_FILE_PATH:", err);
    }

    // 2. Only write to local repository DATA_FILE_PATH if NOT running in serverless (avoids EROFS completely)
    if (!isServerless) {
      try {
        const dir = path.dirname(DATA_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const tempPath = `${DATA_FILE_PATH}.tmp.${Date.now()}`;
        fs.writeFileSync(tempPath, jsonStr, "utf-8");
        fs.renameSync(tempPath, DATA_FILE_PATH);
      } catch (err: unknown) {
        console.warn("Could not write to local DATA_FILE_PATH:", err);
      }
    }

    // Revalidate public portfolio cache
    try {
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/certificates");
      revalidatePath("/photography");
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
