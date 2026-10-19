import { getPortfolioContent } from "@/lib/portfolio-data";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const content = getPortfolioContent();

  return <HomeClient initialContent={content} />;
}