import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("advance_tax");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    estimates: items.map((e) => ({
      id: e._id.toString(),
      client: e.client,
      fy: e.fy,
      estimated: Number(e.estimated) || 0,
      paid: Number(e.paid) || 0,
      nextDue: e.nextDue || "15 Sep (45%)",
      status: e.status || "OK",
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
    const { client, fy, estimated, paid, nextDue, status } = body;

    const col = await getCollection("advance_tax");
    const doc = {
      userId: user.userId,
      client: client || "",
      fy: fy || "2026-27",
      estimated: Number(estimated) || 0,
      paid: Number(paid) || 0,
      nextDue: nextDue || "15 Sep (45%)",
      status: status || "OK",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      estimate: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create advance tax estimate error:", error);
    return NextResponse.json({ error: "Failed to create advance tax estimate" }, { status: 500 });
  }
}
