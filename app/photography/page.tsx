import { getPortfolioContent } from "@/lib/portfolio-data";
import PhotographyClient from "@/components/photography/PhotographyClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Photography & Visual Arts | Pamidi Lakshmi Pavananjali",
  description:
    "Explore the photography portfolio of Pamidi Lakshmi Pavananjali - Awarded 2nd Place in Structures and Macro Photography categories by Drśya Multimedia Club.",
};

export default function PhotographyPage() {
  const content = getPortfolioContent();

  return <PhotographyClient initialContent={content} />;
}
