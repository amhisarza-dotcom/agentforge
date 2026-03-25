import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const chatSchema = z.object({
    message: z.string().min(1).max(5000),
    conversationId: z.string().optional(),
  });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
          const user = await getCurrentUser();
          if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          const agent = await db.agent.findFirst({
                  where: { id: params.id, userId: user.id },
                });
          if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
          const body = await req.json();
          const { message, conversationId } = chatSchema.parse(body);
          let conversation;
          if (conversationId) {
                  conversation = await db.conversation.findFirst({ where: { id: conversationId, agentId: agent.id } });
                }
          if (!conversation) {
                  conversation = await db.conversation.create({
                            data: { agentId: agent.id, title: message.substring(0, 50) },
                          });
                }
          await db.message.create({
                  data: { conversationId: conversation.id, role: "USER", content: message },
                });
          const previousMessages = await db.message.findMany({
                  where: { conversationId: conversation.id },
                  orderBy: { createdAt: "asc" },
                  take: 20,
                });
          const formattedMessages = previousMessages.map(m => ({
                  role: m.role === "USER" ? "user" : "assistant",
                  content: m.content,
                }));
          const systemMessage = agent.systemPrompt || "You are a helpful AI assistant.";
          // Simulated AI response for demo - replace with actual AI API call
          const aiResponse = `I'm ${agent.name}, powered by ${agent.model}. You said: "${message}". This is a demo response. Connect an AI provider (OpenAI, Anthropic) to enable real conversations.`;
          await db.message.create({
                  data: { conversationId: conversation.id, role: "ASSISTANT", content: aiResponse },
                });
          return NextResponse.json({
                  response: aiResponse,
                  conversationId: conversation.id,
                });
        } catch (error) {
          if (error instanceof z.ZodError) {
                  return NextResponse.json({ error: error.errors }, { status: 400 });
                }
          return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
        }
  }
