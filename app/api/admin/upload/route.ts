import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedAdmin } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  // 1. Authorization check
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Validate file type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Allowed formats: PNG, JPG, WebP, GIF, SVG, and PDF.",
        },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // 4. Sanitize file name
    const originalName = file.name || "upload";
    const extension = path.extname(originalName).toLowerCase() || ".png";
    const baseName = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);

    const uniqueName = `${Date.now()}-${baseName}${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let savedUrl = "";

    // 5. Try writing to public/uploads (local dev / writable filesystem)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, buffer);
      savedUrl = `/uploads/${uniqueName}`;
    } catch {
      // Serverless fallback (Vercel / read-only filesystem):
      // Return base64 Data URL for zero-disk dependency that renders anywhere
      const mimeType = file.type || "image/png";
      savedUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      url: savedUrl,
      name: originalName,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "File upload failed";
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
