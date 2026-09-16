import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getCollection } from "./mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const AUTH_SECRET_STR =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "caconnect-production-super-secure-auth-secret-key-2026";

const SECRET_KEY = new TextEncoder().encode(AUTH_SECRET_STR);
export const COOKIE_NAME = "caconnect_session";

export interface UserDoc {
  _id?: any;
  userId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AuthSessionUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Hash plaintext password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT session token
 */
export async function createSessionToken(payload: AuthSessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verify JWT session token
 */
export async function verifySessionToken(token: string): Promise<AuthSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

/**
 * Ensures the required demo user exists in the database
 */
export async function ensureDemoUser(): Promise<UserDoc> {
  const demoEmail = "demo@caconnect.com";
  const defaultUser: UserDoc = {
    userId: "u_demo_ca",
    email: demoEmail,
    passwordHash: "$2a$10$N.Z8t0K8j5G4aWv7z7e7veGv4K9Z.2y1o5g9l.1v3x4y7z8a9b0c",
    name: "Sthambhalliance",
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  try {
    const usersCol = await getCollection<UserDoc>("users");
    const user = await usersCol.findOne({ email: demoEmail });
    if (!user) {
      const passwordHash = await hashPassword("demo123");
      const newUser: UserDoc = {
        userId: "u_demo_ca",
        email: demoEmail,
        passwordHash,
        name: "Sthambhalliance",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      const result = await usersCol.insertOne(newUser);
      return { ...newUser, _id: result.insertedId };
    }
    return user;
  } catch (err) {
    console.warn("MongoDB ensureDemoUser notice:", err);
    return defaultUser;
  }
}

/**
 * Extracts and verifies authenticated user from NextRequest or standard Request
 */
export async function getAuthUser(
  request?: NextRequest | Request,
): Promise<AuthSessionUser | null> {
  let token: string | undefined;

  if (request && "cookies" in request && typeof request.cookies.get === "function") {
    token = request.cookies.get(COOKIE_NAME)?.value;
  }

  if (!token && request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${COOKIE_NAME}=`));
      if (match) {
        token = match.substring(`${COOKIE_NAME}=`.length);
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // In non-Server Component context
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}
