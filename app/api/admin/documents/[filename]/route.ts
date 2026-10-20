import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedAdmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    filename: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  // 1. Verify admin session authentication
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated || !auth.username) {
    return NextResponse.json(
      {
        error: "Access Denied: This document is stored in the private administrator vault. Please log in as admin to access.",
      },
      { status: 401 }
    );
  }

  // 2. Resolve and sanitize requested filename to prevent path traversal
  const { filename } = await params;
  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "Invalid filename parameter." }, { status: 400 });
  }

  const safeFilename = path.basename(filename);
  let resolvedPath = path.join(process.cwd(), "vault", "documents", safeFilename);

  if (!fs.existsSync(resolvedPath)) {
    const tmpPath = path.join("/tmp", "vault", "documents", safeFilename);
    if (fs.existsSync(tmpPath)) {
      resolvedPath = tmpPath;
    }
  }

  // 3. Verify file exists in vault
  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json(
      { error: "Requested document was not found in the secure vault." },
      { status: 404 }
    );
  }

  try {
    const fileBuffer = fs.readFileSync(resolvedPath);

    // 4. Return document securely with strict anti-caching & anti-scraping headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeFilename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Error reading vault document:", err);
    return NextResponse.json(
      { error: "Internal server error reading vault document." },
      { status: 500 }
    );
  }
}
