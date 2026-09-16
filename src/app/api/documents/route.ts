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
    const col = await getCollection("documents");
    const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      docRequests: items.map((d) => ({
        id: d._id.toString(),
        title: d.title,
        client: d.client,
        received: d.received || "0 of 0",
        expires: d.expires || "",
        status: d.status || "Open",
        items: d.items || [],
        message: d.message || "",
        createdAt: d.createdAt || "",
      })),
    });
  } catch (err) {
    console.warn("MongoDB GET documents fallback:", err);
    return NextResponse.json({ docRequests: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, client, items, message, days, expires } = body;

    if (!title || !client) {
      return NextResponse.json(
        { error: "Title and client are required" },
        { status: 400 },
      );
    }

    const docItems = Array.isArray(items) ? items : [];
    const expiryDate =
      expires ||
      new Date(Date.now() + Number(days || 30) * 86400000).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const col = await getCollection("documents");
    const doc = {
      userId: user.userId,
      title: title.trim(),
      client: client.trim(),
      items: docItems,
      received: `0 of ${docItems.length}`,
      expires: expiryDate,
      message: message || "",
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      docRequest: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create document request error:", error);
    return NextResponse.json({ error: "Failed to create document request" }, { status: 500 });
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
    const col = await getCollection("documents");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Failed to delete document request" }, { status: 500 });
  }
}
