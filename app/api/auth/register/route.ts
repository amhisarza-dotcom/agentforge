import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
  });

export async function POST(req: Request) {
    try {
          const body = await req.json();
          const { email, password, name } = registerSchema.parse(body);
          const existingUser = await db.user.findUnique({ where: { email } });
          if (existingUser) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
          const hashedPassword = await hash(password, 12);
          const user = await db.user.create({ data: { email, password: hashedPassword, name } });
          const token = await createToken(user.id);
          const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
          response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
          return response;
        } catch (error) {
          if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
          return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
  }
