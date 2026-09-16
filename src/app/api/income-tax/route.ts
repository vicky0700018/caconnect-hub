import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const demandsCol = await getCollection("income_tax");
  const items = await demandsCol.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    demands: items.map((d) => ({
      id: d._id.toString(),
      client: d.client,
      pan: d.pan,
      ay: d.ay,
      amount: Number(d.amount) || 0,
      din: d.din || "",
      section: d.section || "143(1)(a)",
      raised: d.raised || "",
      raisedOn: d.raised || d.raisedOn || "",
      status: d.status || "Open",
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

    // Check if batch import or single record
    if (Array.isArray(body.demands)) {
      const col = await getCollection("income_tax");
      const docsToInsert = body.demands.map((d: any) => ({
        userId: user.userId,
        client: d.client || d.pan || "Taxpayer",
        pan: (d.pan || "").trim().toUpperCase(),
        ay: d.ay || d.assessment_year || "AY 2026-27",
        amount: Number(d.amount) || 0,
        din: d.din || "",
        section: d.section || "143(1)(a)",
        raised: d.raised || d.raised_on || new Date().toLocaleDateString("en-GB"),
        raisedOn: d.raised || d.raised_on || new Date().toLocaleDateString("en-GB"),
        status: d.status || "Open",
        createdAt: new Date().toISOString(),
      }));

      if (docsToInsert.length > 0) {
        await col.insertMany(docsToInsert);
      }

      return NextResponse.json({ success: true, count: docsToInsert.length });
    }

    const { client, pan, ay, amount, din, section, raised, status } = body;

    const col = await getCollection("income_tax");
    const doc = {
      userId: user.userId,
      client: client || pan || "Taxpayer",
      pan: (pan || "").trim().toUpperCase(),
      ay: ay || "AY 2026-27",
      amount: Number(amount) || 0,
      din: din || "",
      section: section || "143(1)(a)",
      raised: raised || new Date().toLocaleDateString("en-GB"),
      raisedOn: raised || new Date().toLocaleDateString("en-GB"),
      status: status || "Open",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      demand: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create income tax record error:", error);
    return NextResponse.json({ error: "Failed to create income tax record" }, { status: 500 });
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
    const col = await getCollection("income_tax");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete income tax record error:", error);
    return NextResponse.json({ error: "Failed to delete income tax record" }, { status: 500 });
  }
}
