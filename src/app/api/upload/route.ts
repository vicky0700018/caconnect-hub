import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "caconnect_uploads";
    const requestId = formData.get("requestId") as string | null;

    // Check auth unless it's a client uploading for a document request
    const user = await getAuthUser(request);
    if (!user && !requestId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, folder, "auto");

    return NextResponse.json({
      success: true,
      url: result.secure_url || result.url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      originalName: file.name,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to Cloudinary" },
      { status: 500 },
    );
  }
}
