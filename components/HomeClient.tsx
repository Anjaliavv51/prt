"use client";

import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import BentoGrid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { PortfolioContent } from "@/lib/portfolio-data";
import { useLivePortfolioContent } from "@/lib/client-content-sync";

interface HomeClientProps {
  initialContent: PortfolioContent;
}

export default function HomeClient({ initialContent }: HomeClientProps) {
  const content = useLivePortfolioContent(initialContent);

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav
          navItems={content.navItems}
          resumeLink={content.profile.resumeLink}
        />
        <Hero data={content.profile} />
        <BentoGrid
          gridItems={content.gridItems}
          resumeLink={content.profile.resumeLink}
        />
        <RecentProjects projects={content.projects} />
        <Experience workExperience={content.workExperience} />
        <Footer
          email={content.profile.email}
          socialMedia={content.socialMedia}
        />
      </div>
    </main>
  );
}
