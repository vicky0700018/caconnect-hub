import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const col = await getCollection("clients");
    const clients = await col.find({ userId: user.userId }).sort({ name: 1 }).toArray();

    return NextResponse.json({
      clients: clients.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        type: c.type,
        kycEntityType: c.kycEntityType,
        pan: c.pan,
        gstin: c.gstin,
        email: c.email,
        phone: c.phone,
        services: c.services || [],
        notes: c.notes || "",
      })),
    });
  } catch (err) {
    console.warn("MongoDB GET clients fallback:", err);
    return NextResponse.json({ clients: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, kycEntityType, pan, gstin, email, phone, services, notes } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    const col = await getCollection("clients");
    const doc = {
      userId: user.userId,
      name: name.trim(),
      type: type || "Individual",
      kycEntityType: kycEntityType || "",
      pan: (pan || "").trim().toUpperCase(),
      gstin: (gstin || "").trim().toUpperCase(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      services: Array.isArray(services) ? services : [],
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      client: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, type, kycEntityType, pan, gstin, email, phone, services, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Client id is required" }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const col = await getCollection("clients");

    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const updateDoc: any = {};
    if (name !== undefined) updateDoc.name = name.trim();
    if (type !== undefined) updateDoc.type = type;
    if (kycEntityType !== undefined) updateDoc.kycEntityType = kycEntityType;
    if (pan !== undefined) updateDoc.pan = (pan || "").trim().toUpperCase();
    if (gstin !== undefined) updateDoc.gstin = (gstin || "").trim().toUpperCase();
    if (email !== undefined) updateDoc.email = (email || "").trim();
    if (phone !== undefined) updateDoc.phone = (phone || "").trim();
    if (services !== undefined) updateDoc.services = Array.isArray(services) ? services : [];
    if (notes !== undefined) updateDoc.notes = notes;
    updateDoc.updatedAt = new Date().toISOString();

    await col.updateOne(query, { $set: updateDoc });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
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
    return NextResponse.json({ error: "Client id is required" }, { status: 400 });
  }

  try {
    const { ObjectId } = await import("mongodb");
    const col = await getCollection("clients");

    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);

    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete client error:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
