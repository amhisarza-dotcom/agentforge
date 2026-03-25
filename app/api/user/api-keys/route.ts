import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { randomBytes } from "crypto";
import { z } from "zod";

const createKeySchema = z.object({
    name: z.string().min(1).max(50),
  });

export async function GET() {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const keys = await db.apiKey.findMany({
                  where: { userId: user.id },
                  select: { id: true, name: true, key: true, createdAt: true },
                  orderBy: { createdAt: "desc" },
                });
          return NextResponse.json(keys);
        } catch (error) {
          return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 });
        }
  }

export async function POST(req: NextRequest) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const body = await req.json();
          const { name } = createKeySchema.parse(body);
          const keyValue = `af_${randomBytes(32).toString("hex")}`;
          const apiKey = await db.apiKey.create({
                  data: { name, key: keyValue, userId: user.id },
                  select: { id: true, name: true, key: true, createdAt: true },
                });
          return NextResponse.json(apiKey, { status: 201 });
        } catch (error) {
          if (error instanceof z.ZodError) {
                  return NextResponse.json({ error: error.errors }, { status: 400 });
                }
          return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
        }
  }
