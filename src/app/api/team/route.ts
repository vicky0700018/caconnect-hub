import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teamCol = await getCollection("team");
  const items = await teamCol.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    team: items.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      role: t.role,
      joined: t.joined || "",
      activeCount: Number(t.activeCount) || 0,
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
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const teamCol = await getCollection("team");
    const doc = {
      userId: user.userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || "Staff",
      joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      activeCount: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await teamCol.insertOne(doc);

    return NextResponse.json({
      success: true,
      member: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create team member error:", error);
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 });
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
    const col = await getCollection("team");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 });
  }
}
