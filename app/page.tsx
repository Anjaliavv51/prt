import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import BentoGrid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { getPortfolioContent } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const content = getPortfolioContent();

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={content.navItems} />
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