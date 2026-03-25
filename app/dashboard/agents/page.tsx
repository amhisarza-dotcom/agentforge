import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
export default async function AgentsPage() {
  const user = await getCurrentUser();
    if (!user) return null;
      const agents = await db.agent.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { _count: { select: { conversations: true } } } });
        const statusColors: Record<string, string> = { DRAFT: "bg-yellow-500/20 text-yellow-400", ACTIVE: "bg-green-500/20 text-green-400", PAUSED: "bg-orange-500/20 text-orange-400", ARCHIVED: "bg-dark-500/20 text-dark-400" };
          return (
              <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                            <div><h1 className="text-3xl font-bold">Agents</h1><p className="text-dark-400 mt-1">Manage your AI agents</p></div>
                                    <Link href="/dashboard/agents/new" className="btn-primary">+ Create Agent</Link>
                                          </div>
                                                {agents.length === 0 ? (
                                                        <div className="card text-center py-12">
                                                                  <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">&#129302;</span></div>
                                                                            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
                                                                                      <p className="text-dark-400 mb-6">Create your first AI agent to get started</p>
                                                                                                <Link href="/dashboard/agents/new" className="btn-primary">Create Your First Agent</Link>
                                                                                                        </div>
                                                                                                              ) : (
                                                                                                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                                                                {agents.map((agent) => (
                                                                                                                                            <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} className="card hover:border-primary-500 transition-colors group">
                                                                                                                                                          <div className="flex items-start justify-between mb-3">
                                                                                                                                                                          <h3 className="text-lg font-semibold group-hover:text-primary-400 transition-colors">{agent.name}</h3>
                                                                                                                                                                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[agent.status] || ""}`}>{agent.status}</span>
                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                      <p className="text-sm text-dark-400 mb-4 line-clamp-2">{agent.description || "No description"}</p>
                                                                                                                                                                                                                                    <div className="flex items-center justify-between text-xs text-dark-400">
                                                                                                                                                                                                                                                    <span>{agent.model}</span>
                                                                                                                                                                                                                                                                    <span>{agent._count.conversations} conversations</span>
                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                              </Link>
                                                                                                                                                                                                                                                                                                        ))}
                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                      )}
                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                            }
