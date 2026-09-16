import { NextResponse } from "next/server";
import {
  ensureDemoUser,
  verifyPassword,
  createSessionToken,
  COOKIE_NAME,
  type UserDoc,
} from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Direct support for demo account credentials
    if (cleanEmail === "demo@caconnect.com" && password === "demo123") {
      try {
        await ensureDemoUser();
      } catch (e) {
        console.warn("MongoDB demo user sync skipped:", e);
      }

      const sessionPayload = {
        userId: "u_demo_ca",
        email: cleanEmail,
        name: "Sthambhalliance",
        role: "admin",
      };

      const token = await createSessionToken(sessionPayload);
      const response = NextResponse.json({
        success: true,
        user: sessionPayload,
      });

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Try finding user in MongoDB for other accounts
    try {
      const usersCol = await getCollection<UserDoc>("users");
      const user = await usersCol.findOne({ email: cleanEmail });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const sessionPayload = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = await createSessionToken(sessionPayload);
      const response = NextResponse.json({
        success: true,
        user: sessionPayload,
      });

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (dbErr: any) {
      console.error("Database auth lookup error:", dbErr);
      return NextResponse.json(
        { error: "Database authentication error. Please verify MONGODB_URI in .env" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please check server logs." },
      { status: 500 },
    );
  }
}
