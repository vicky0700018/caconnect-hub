import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookingsCol = await getCollection("marketplace_bookings");
  const items = await bookingsCol
    .find({
      $or: [
        { userId: user.userId },
        { isPublicLead: true },
        { userId: "u_demo_ca" },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    bookings: items.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      email: b.email,
      phone: b.phone,
      city: b.city,
      service: b.service,
      requestDate: b.requestDate,
      amount: Number(b.amount) || 0,
      platformFee: Number(b.platformFee) || 0,
      message: b.message || "",
      practiceName: b.practiceName || "",
      practiceSlug: b.practiceSlug || "",
      status: b.status || "requested",
      createdAt: b.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getAuthUser(request);

  try {
    const body = await request.json();
    const {
      name,
      clientName,
      email,
      phone,
      city,
      service,
      amount,
      budget,
      platformFee,
      message,
      notes,
      status,
      practiceName,
      practiceSlug,
    } = body;

    const finalName = (name || clientName || "").trim();
    const finalMessage = (message || notes || "").trim();
    const finalAmount =
      Number(amount) ||
      Number(budget ? String(budget).replace(/[^0-9]/g, "") : 2500) ||
      2500;
    const finalFee = Number(platformFee) || Math.round(finalAmount * 0.05);

    const bookingsCol = await getCollection("marketplace_bookings");

    const doc = {
      userId: user ? user.userId : "u_demo_ca",
      isPublicLead: !user,
      name: finalName || "Prospective Client",
      email: email || "",
      phone: phone || "",
      city: city || "",
      service: service || "Tax Consultation",
      requestDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      amount: finalAmount,
      platformFee: finalFee,
      message: finalMessage,
      practiceName: practiceName || "Deshpande & Associates",
      practiceSlug: practiceSlug || "deshpande-associates-pune",
      status: status || "requested",
      createdAt: new Date().toISOString(),
    };

    const result = await bookingsCol.insertOne(doc);

    return NextResponse.json({
      success: true,
      booking: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
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

    const bookingsCol = await getCollection("marketplace_bookings");
    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }

    await bookingsCol.updateOne(query, {
      $set: { status, updatedAt: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
