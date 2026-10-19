import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getPortfolioContent, savePortfolioContent, PortfolioContent } from "@/lib/portfolio-data";

export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const content = getPortfolioContent();
  return NextResponse.json({ content });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<PortfolioContent> = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    const result = savePortfolioContent(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Save failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio content updated successfully",
      content: getPortfolioContent(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update content";
    console.error("Error saving content:", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
