import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("notice_tracker");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    notices: items.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      noticeType: n.noticeType || "",
      client: n.client,
      drafted: n.drafted || "",
      status: n.status || "Received",
      amount: Number(n.amount) || 0,
      notes: n.notes || "",
      deadline: n.deadline || "",
    })),
  });
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, noticeType, client, drafted, status, amount, notes, deadline } = body;

    if (!title || !client) {
      return NextResponse.json(
        { error: "Title and client are required" },
        { status: 400 },
      );
    }

    const col = await getCollection("notice_tracker");
    const doc = {
      userId: user.userId,
      title: title.trim(),
      noticeType: noticeType || "143(1)(a) Intimation",
      client: client.trim(),
      drafted: drafted || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: status || "Received",
      amount: Number(amount) || 0,
      notes: notes || "",
      deadline: deadline || "",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      notice: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create notice error:", error);
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
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
    const col = await getCollection("notice_tracker");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete notice error:", error);
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
