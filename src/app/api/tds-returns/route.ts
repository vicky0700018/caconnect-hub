import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("tds_returns");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    tdsReturns: items.map((t) => ({
      id: t._id.toString(),
      client: t.client,
      quarter: t.quarter,
      form: t.form,
      tdsTotal: Number(t.tdsTotal) || 0,
      flags: Number(t.flags) || 0,
      status: t.status || "Pending",
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
    const { client, quarter, form, tdsTotal, flags, status } = body;

    if (!client) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    const col = await getCollection("tds_returns");
    const doc = {
      userId: user.userId,
      client: client.trim(),
      quarter: quarter || "Q2 FY2026-27",
      form: form || "24Q",
      tdsTotal: Number(tdsTotal) || 0,
      flags: Number(flags) || 0,
      status: status || "Preparation",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      tdsReturn: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create TDS return error:", error);
    return NextResponse.json({ error: "Failed to create TDS return" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, flags } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const col = await getCollection("tds_returns");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const updateFields: any = { updatedAt: new Date().toISOString() };
    if (status !== undefined) updateFields.status = status;
    if (flags !== undefined) updateFields.flags = flags;

    await col.updateOne(query, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update TDS return error:", error);
    return NextResponse.json({ error: "Failed to update TDS return" }, { status: 500 });
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
    const col = await getCollection("tds_returns");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete TDS return error:", error);
    return NextResponse.json({ error: "Failed to delete TDS return" }, { status: 500 });
  }
}
