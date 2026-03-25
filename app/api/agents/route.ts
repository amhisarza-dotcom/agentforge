import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const createAgentSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    systemPrompt: z.string().min(1),
    model: z.string().default("gpt-4"),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(1).max(32000).default(2048),
  });

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const agents = await db.agent.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(agents);
  }

export async function POST(req: Request) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const body = await req.json();
          const data = createAgentSchema.parse(body);
          const agent = await db.agent.create({ data: { ...data, userId: user.id } });
          return NextResponse.json(agent, { status: 201 });
        } catch (error) {
          if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
          return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
  }
