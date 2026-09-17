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
    const col = await getCollection("fees");
    const items = await col.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      fees: items.map((f) => ({
        id: f._id.toString(),
        forWhat: f.forWhat,
        service: f.service,
        client: f.client,
        amount: Number(f.amount) || 0,
        due: f.due || "",
        status: f.status || "Invoiced",
      })),
    });
  } catch (err) {
    console.warn("MongoDB GET fees fallback:", err);
    return NextResponse.json({ fees: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { forWhat, service, client, amount, due, status } = body;

    if (!forWhat || !client || amount === undefined) {
      return NextResponse.json(
        { error: "Description, client and amount are required" },
        { status: 400 },
      );
    }

    const col = await getCollection("fees");
    const doc = {
      userId: user.userId,
      forWhat: forWhat.trim(),
      service: service || "General",
      client: client.trim(),
      amount: Number(amount) || 0,
      due: due || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: status || "Invoiced",
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      fee: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create fee error:", error);
    return NextResponse.json({ error: "Failed to create fee" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, forWhat, service, client, amount, due, status } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const col = await getCollection("fees");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const updateDoc: any = {};
    if (forWhat !== undefined) updateDoc.forWhat = forWhat.trim();
    if (service !== undefined) updateDoc.service = service;
    if (client !== undefined) updateDoc.client = client.trim();
    if (amount !== undefined) updateDoc.amount = Number(amount) || 0;
    if (due !== undefined) updateDoc.due = due;
    if (status !== undefined) updateDoc.status = status;
    updateDoc.updatedAt = new Date().toISOString();

    await col.updateOne(query, {
      $set: updateDoc,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update fee error:", error);
    return NextResponse.json({ error: "Failed to update fee" }, { status: 500 });
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
    const col = await getCollection("fees");
    let query: any = { userId: user.userId };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id), userId: user.userId };
    } else {
      query = { id, userId: user.userId };
    }

    const res = await col.deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: res.deletedCount });
  } catch (error: any) {
    console.error("Delete fee error:", error);
    return NextResponse.json({ error: "Failed to delete fee" }, { status: 500 });
  }
}
