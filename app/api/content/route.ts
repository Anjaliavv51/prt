import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const content = getPortfolioContent();
  return NextResponse.json(
    { content },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
