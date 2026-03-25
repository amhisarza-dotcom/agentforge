import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

export async function POST(req: Request) {
    try {
          const body = await req.json();
          const { email, password } = loginSchema.parse(body);
          const user = await db.user.findUnique({ where: { email } });
          if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          const isValid = await compare(password, user.password);
          if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          const token = await createToken(user.id);
          const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
          response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
          return response;
        } catch (error) {
          if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
          return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
  }
