import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
    if (!user) return null;
      const agent = await db.agent.findUnique({ where: { id: params.id, userId: user.id }, include: { conversations: { orderBy: { createdAt: "desc" }, take: 5 }, tools: true, _count: { select: { conversations: true } } } });
        if (!agent) notFound();
          const statusColors: Record<string, string> = { DRAFT: "bg-yellow-500/20 text-yellow-400", ACTIVE: "bg-green-500/20 text-green-400", PAUSED: "bg-orange-500/20 text-orange-400", ARCHIVED: "bg-dark-500/20 text-dark-400" };
            return (
                <div className="p-8">
                      <div className="mb-6"><Link href="/dashboard/agents" className="text-sm text-dark-400 hover:text-white">&larr; Back to Agents</Link></div>
                            <div className="flex items-start justify-between mb-8">
                                    <div><h1 className="text-3xl font-bold">{agent.name}</h1><p className="text-dark-400 mt-1">{agent.description || "No description"}</p></div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[agent.status] || ""}`}>{agent.status}</span>
                                                  </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                                <div className="card"><p className="text-sm text-dark-400">Model</p><p className="text-lg font-semibold mt-1">{agent.model}</p></div>
                                                                        <div className="card"><p className="text-sm text-dark-400">Temperature</p><p className="text-lg font-semibold mt-1">{agent.temperature}</p></div>
                                                                                <div className="card"><p className="text-sm text-dark-400">Conversations</p><p className="text-lg font-semibold mt-1">{agent._count.conversations}</p></div>
                                                                                      </div>
                                                                                            <div className="card mb-6">
                                                                                                    <h2 className="text-lg font-semibold mb-3">System Prompt</h2>
                                                                                                            <div className="bg-dark-900 rounded-lg p-4 text-sm text-dark-300 whitespace-pre-wrap">{agent.systemPrompt}</div>
                                                                                                                  </div>
                                                                                                                        {agent.tools.length > 0 && (
                                                                                                                                <div className="card mb-6">
                                                                                                                                          <h2 className="text-lg font-semibold mb-3">Tools ({agent.tools.length})</h2>
                                                                                                                                                    <div className="space-y-2">{agent.tools.map(tool => (<div key={tool.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg"><div><p className="font-medium">{tool.name}</p><p className="text-sm text-dark-400">{tool.type}</p></div></div>))}</div>
                                                                                                                                                            </div>
                                                                                                                                                                  )}
                                                                                                                                                                        <div className="card">
                                                                                                                                                                                <h2 className="text-lg font-semibold mb-3">Recent Conversations</h2>
                                                                                                                                                                                        {agent.conversations.length === 0 ? <p className="text-dark-400">No conversations yet</p> : (
                                                                                                                                                                                                  <div className="space-y-2">{agent.conversations.map(conv => (<div key={conv.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg"><p className="font-medium">{conv.title || "Untitled"}</p><p className="text-sm text-dark-400">{new Date(conv.createdAt).toLocaleDateString()}</p></div>))}</div>
                                                                                                                                                                                                          )}
                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                      );
                                                                                                                                                                                                                      }
