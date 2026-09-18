import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET public document request info by id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const col = await getCollection("documents");
    let doc: any = null;
    if (ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) });
    }
    if (!doc) {
      doc = await col.findOne({ id });
    }

    if (!doc) {
      return NextResponse.json({ error: "Document request not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      request: {
        id: doc._id?.toString() || doc.id,
        title: doc.title,
        client: doc.client,
        message: doc.message || "",
        items: doc.items || [],
        expires: doc.expires,
        status: doc.status || "Open",
        received: doc.received,
      },
    });
  } catch (error: any) {
    console.error("Public GET document request error:", error);
    return NextResponse.json({ error: "Failed to load request" }, { status: 500 });
  }
}

// POST when client uploads a file for a document request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, itemId, fileName, fileUrl, publicId, format, bytes } = body;

    if (!requestId || !fileUrl) {
      return NextResponse.json({ error: "requestId and fileUrl are required" }, { status: 400 });
    }

    const docCol = await getCollection("documents");
    let doc: any = null;
    let query: any = {};

    if (ObjectId.isValid(requestId)) {
      query = { _id: new ObjectId(requestId) };
      doc = await docCol.findOne(query);
    }
    if (!doc) {
      query = { id: requestId };
      doc = await docCol.findOne(query);
    }

    if (!doc) {
      return NextResponse.json({ error: "Document request not found" }, { status: 404 });
    }

    // Update items inside document request
    const items = doc.items || [];
    const updatedItems = items.map((item: any) => {
      if (item.id === itemId || item.name === itemId) {
        return {
          ...item,
          fileUrl,
          fileName,
          uploadedAt: new Date().toISOString(),
          status: "Uploaded",
        };
      }
      return item;
    });

    const uploadedCount = updatedItems.filter((i: any) => i.fileUrl || i.status === "Uploaded").length;
    const totalCount = updatedItems.length || 1;
    const isAllDone = uploadedCount >= totalCount;
    const newStatus = isAllDone ? "Completed" : "Open";
    const newReceived = `${uploadedCount} of ${totalCount}`;

    await docCol.updateOne(query, {
      $set: {
        items: updatedItems,
        received: newReceived,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      },
    });

    // Also insert into files collection for CA view
    const formatBytes = (b: number) => {
      if (!b) return "0 KB";
      if (b < 1024) return `${b} B`;
      if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
      return `${(b / 1048576).toFixed(1)} MB`;
    };

    const filesCol = await getCollection("files");
    await filesCol.insertOne({
      userId: doc.userId || "u_demo_ca",
      requestId: doc._id?.toString() || doc.id,
      name: fileName || "Document",
      client: doc.client || "Client",
      request: doc.title || "Document Request",
      url: fileUrl,
      publicId: publicId || "",
      format: format || fileName?.split(".").pop() || "",
      bytes: bytes || 0,
      size: formatBytes(bytes || 0),
      uploaded: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      received: newReceived,
      status: newStatus,
      updatedItems,
    });
  } catch (error: any) {
    console.error("Public POST document file upload error:", error);
    return NextResponse.json({ error: "Failed to update document request" }, { status: 500 });
  }
}
