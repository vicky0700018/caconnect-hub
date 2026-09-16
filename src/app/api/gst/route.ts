import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCollection("gst_reconciliations");
  const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    recons: items.map((r) => ({
      id: r._id.toString(),
      client: r.client,
      month: r.month,
      matched: Number(r.matched) || 0,
      mismatched: Number(r.mismatched) || 0,
      missing: Number(r.missing) || 0,
      registerTotal: Number(r.registerTotal) || 0,
      portalTotal: Number(r.portalTotal) || 0,
      status: r.status || "Completed",
      createdAt: r.createdAt || "",
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
    const { client, month, matched, mismatched, missing, registerTotal, portalTotal, status } = body;

    const col = await getCollection("gst_reconciliations");
    const doc = {
      userId: user.userId,
      client: client || "",
      month: month || "August 2026",
      matched: Number(matched) || 0,
      mismatched: Number(mismatched) || 0,
      missing: Number(missing) || 0,
      registerTotal: Number(registerTotal) || 0,
      portalTotal: Number(portalTotal) || 0,
      status: status || "Completed",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      recon: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create GST recon error:", error);
    return NextResponse.json({ error: "Failed to save reconciliation" }, { status: 500 });
  }
}
