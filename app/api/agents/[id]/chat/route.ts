import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const chatSchema = z.object({
    message: z.string().min(1).max(5000),
    conversationId: z.string().optional(),
});

async function callOpenAI(model: string, systemPrompt: string, messages: Array<{role: string; content: string}>, temperature: number, maxTokens: number) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "No response generated.";
}

async function callAnthropic(model: string, systemPrompt: string, messages: Array<{role: string; content: string}>, temperature: number, maxTokens: number) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model,
            system: systemPrompt,
            messages,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Anthropic API error: ${res.status}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "No response generated.";
}

const MODEL_MAP: Record<string, { provider: "openai" | "anthropic"; apiModel: string }> = {
    "gpt-4": { provider: "openai", apiModel: "gpt-4" },
    "gpt-3.5-turbo": { provider: "openai", apiModel: "gpt-3.5-turbo" },
    "claude-3-opus": { provider: "anthropic", apiModel: "claude-3-opus-20240229" },
    "claude-3-sonnet": { provider: "anthropic", apiModel: "claude-3-sonnet-20240229" },
};

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
            conversation = await db.conversation.findFirst({
                where: { id: conversationId, agentId: agent.id }
            });
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
            role: m.role === "USER" ? "user" as const : "assistant" as const,
            content: m.content,
        }));

        const systemPrompt = agent.systemPrompt || "You are a helpful AI assistant.";
        const modelConfig = MODEL_MAP[agent.model];

        let aiResponse: string;

        if (!modelConfig) {
            aiResponse = `Unsupported model: ${agent.model}. Please configure your agent with a supported model.`;
        } else if (modelConfig.provider === "openai") {
            if (!process.env.OPENAI_API_KEY) {
                aiResponse = "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
            } else {
                aiResponse = await callOpenAI(modelConfig.apiModel, systemPrompt, formattedMessages, agent.temperature, agent.maxTokens);
            }
        } else {
            if (!process.env.ANTHROPIC_API_KEY) {
                aiResponse = "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.";
            } else {
                aiResponse = await callAnthropic(modelConfig.apiModel, systemPrompt, formattedMessages, agent.temperature, agent.maxTokens);
            }
        }

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
        const errorMessage = error instanceof Error ? error.message : "Failed to process message";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
