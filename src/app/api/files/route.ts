import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const col = await getCollection("files");
    const items = await col.find({ userId: user.userId }).sort({ uploadedAt: -1 }).toArray();

    return NextResponse.json({
      files: items.map((f) => ({
        id: f._id.toString(),
        name: f.name,
        client: f.client,
        request: f.request || "General Upload",
        url: f.url,
        publicId: f.publicId,
        format: f.format,
        bytes: f.bytes,
        size: f.size,
        uploaded: f.uploaded || f.uploadedAt,
      })),
    });
  } catch (err) {
    console.warn("MongoDB GET files fallback:", err);
    return NextResponse.json({ files: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, client, request: requestName, url, publicId, format, bytes } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "File name and url are required" },
        { status: 400 },
      );
    }

    const formatBytes = (b: number) => {
      if (!b) return "0 KB";
      if (b < 1024) return `${b} B`;
      if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
      return `${(b / 1048576).toFixed(1)} MB`;
    };

    const col = await getCollection("files");
    const doc = {
      userId: user.userId,
      name: name.trim(),
      client: client ? client.trim() : "General",
      request: requestName ? requestName.trim() : "Direct Upload",
      url,
      publicId: publicId || "",
      format: format || name.split(".").pop() || "",
      bytes: bytes || 0,
      size: formatBytes(bytes || 0),
      uploaded: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      uploadedAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      file: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Save file record error:", error);
    return NextResponse.json({ error: "Failed to save file record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const col = await getCollection("files");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
