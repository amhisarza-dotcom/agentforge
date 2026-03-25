import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateAgentSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    systemPrompt: z.string().max(5000).optional(),
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(100).max(8000).optional(),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  });

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const agent = await db.agent.findFirst({
                  where: { id: params.id, userId: user.id },
                  include: { tools: true, _count: { select: { conversations: true } } },
                });
          if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
          return NextResponse.json(agent);
        } catch (error) {
          return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
        }
  }

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const existing = await db.agent.findFirst({ where: { id: params.id, userId: user.id } });
          if (!existing) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
          const body = await req.json();
          const validated = updateAgentSchema.parse(body);
          const agent = await db.agent.update({
                  where: { id: params.id },
                  data: validated,
                  include: { tools: true, _count: { select: { conversations: true } } },
                });
          return NextResponse.json(agent);
        } catch (error) {
          if (error instanceof z.ZodError) {
                  return NextResponse.json({ error: error.errors }, { status: 400 });
                }
          return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
        }
  }

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const existing = await db.agent.findFirst({ where: { id: params.id, userId: user.id } });
          if (!existing) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
          await db.agent.delete({ where: { id: params.id } });
          return NextResponse.json({ message: "Agent deleted successfully" });
        } catch (error) {
          return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
        }
  }
