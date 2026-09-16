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
    const col = await getCollection("deadlines");

    // Clean up any previously auto-seeded mock deadlines
    const mockClients = [
      "Orbit Software Solutions",
      "Sunrise Textiles Pvt Ltd",
      "Tushar Kumar",
      "Anand Provision Stores",
      "Ganesh Steel Works",
      "Vaidya Healthcare LLP",
      "Konark Foods",
      "Pune Coworks LLP",
    ];
    await col.deleteMany({
      userId: user.userId,
      client: { $in: mockClients },
    });

    const items = await col.find({ userId: user.userId }).sort({ dueDate: 1 }).toArray();

    return NextResponse.json({
      deadlines: items.map((d) => ({
        id: d._id.toString(),
        task: d.task,
        service: d.service,
        period: d.period || "",
        client: d.client,
        daysOverdue: d.daysOverdue || 0,
        dueDate: d.dueDate || "",
        status: d.status || "Open",
        notes: d.notes || "",
      })),
    });
  } catch (err) {
    console.warn("MongoDB GET deadlines fallback:", err);
    return NextResponse.json({ deadlines: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { task, service, period, client, dueDate, status, notes } = body;

    if (!task || !client) {
      return NextResponse.json(
        { error: "Task and client are required" },
        { status: 400 },
      );
    }

    const col = await getCollection("deadlines");
    const doc = {
      userId: user.userId,
      task: task.trim(),
      service: service || "General",
      period: period || "",
      client: client.trim(),
      daysOverdue: 0,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      status: status || "Open",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      deadline: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create deadline error:", error);
    return NextResponse.json({ error: "Failed to create deadline" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const col = await getCollection("deadlines");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    await col.updateOne(query, {
      $set: { status, updatedAt: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update deadline error:", error);
    return NextResponse.json({ error: "Failed to update deadline" }, { status: 500 });
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
    return NextResponse.json({ error: "Deadline id is required" }, { status: 400 });
  }

  try {
    const col = await getCollection("deadlines");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete deadline error:", error);
    return NextResponse.json({ error: "Failed to delete deadline" }, { status: 500 });
  }
}
