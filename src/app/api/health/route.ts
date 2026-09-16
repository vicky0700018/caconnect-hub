import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ensureDemoUser } from "@/lib/auth-server";

export async function GET() {
  try {
    const db = await getDatabase();
    // Run a lightweight command to verify MongoDB connectivity
    const ping = await db.command({ ping: 1 });

    // Ensure demo user is available in MongoDB
    await ensureDemoUser();

    return NextResponse.json({
      status: "connected",
      database: db.databaseName,
      ok: ping.ok === 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("MongoDB health check error:", error);
    return NextResponse.json(
      {
        status: "disconnected",
        error: error?.message || "Failed to connect to MongoDB",
      },
      { status: 500 },
    );
  }
}
