import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("client_emails");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    emails: items.map((e) => ({
      id: e._id.toString(),
      client: e.client,
      topic: e.topic,
      subject: e.subject,
      body: e.body,
      status: e.status || "Draft",
      notes: e.notes || "",
      createdAt: e.createdAt || "",
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
    const { client, topic, subject, body: emailBody, notes, status } = body;

    const col = await getCollection("client_emails");
    const doc = {
      userId: user.userId,
      client: client || "",
      topic: topic || "General",
      subject: subject || "",
      body: emailBody || "",
      notes: notes || "",
      status: status || "Draft",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      email: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Save client email draft error:", error);
    return NextResponse.json({ error: "Failed to save email draft" }, { status: 500 });
  }
}
