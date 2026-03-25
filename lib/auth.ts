import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me");

export async function createToken(userId: string) {
    return new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);
}

export async function verifyToken(token: string) {
    try {
          const { payload } = await jwtVerify(token, secret);
          return payload as { userId: string };
    } catch {
          return null;
    }
}

export async function getCurrentUser() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload) return null;
    const user = await db.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, name: true, role: true },
    });
    return user;
}
