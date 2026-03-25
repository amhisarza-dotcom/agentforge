import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(1).max(100),
});

export async function GET() {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const profile = await db.user.findUnique({
                  where: { id: user.id },
                  select: { id: true, name: true, email: true, role: true, createdAt: true },
          });
          return NextResponse.json(profile);
    } catch (error) {
          return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const body = await req.json();
          const { name } = updateProfileSchema.parse(body);
          const updated = await db.user.update({
                  where: { id: user.id },
                  data: { name },
                  select: { id: true, name: true, email: true, role: true },
          });
          return NextResponse.json(updated);
    } catch (error) {
          if (error instanceof z.ZodError) {
                  return NextResponse.json({ error: error.errors }, { status: 400 });
          }
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
