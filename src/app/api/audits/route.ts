import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("audits");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    audits: items.map((a) => ({
      id: a._id.toString(),
      client: a.client,
      audit: a.audit,
      year: a.year,
      done: Number(a.done) || 0,
      total: Number(a.total) || 0,
      assigned: a.assigned || "",
      due: a.due || "",
      status: a.status || "In Progress",
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
    const { client, audit, year, done, total, assigned, due, status } = body;

    if (!client || !audit) {
      return NextResponse.json({ error: "Client and audit type are required" }, { status: 400 });
    }

    const col = await getCollection("audits");
    const doc = {
      userId: user.userId,
      client: client.trim(),
      audit: audit || "Tax Audit",
      year: year || "FY2026-27",
      done: Number(done) || 0,
      total: Number(total) || 24,
      assigned: assigned || "Senior Associate",
      due: due || "30 Sept",
      status: status || "Planning",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      audit: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create audit error:", error);
    return NextResponse.json({ error: "Failed to create audit" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, done, status, assigned, due } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const col = await getCollection("audits");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const updateFields: any = { updatedAt: new Date().toISOString() };
    if (done !== undefined) updateFields.done = Number(done);
    if (status !== undefined) updateFields.status = status;
    if (assigned !== undefined) updateFields.assigned = assigned;
    if (due !== undefined) updateFields.due = due;

    await col.updateOne(query, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update audit error:", error);
    return NextResponse.json({ error: "Failed to update audit" }, { status: 500 });
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
    const col = await getCollection("audits");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete audit error:", error);
    return NextResponse.json({ error: "Failed to delete audit" }, { status: 500 });
  }
}
