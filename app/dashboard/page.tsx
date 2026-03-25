import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null;
    const agentCount = await db.agent.count({ where: { userId: user.id } });
    const activeAgents = await db.agent.count({ where: { userId: user.id, status: "ACTIVE" } });
    const totalConversations = await db.conversation.count({ where: { agent: { userId: user.id } } });
    return (
          <div className="p-8">
                <div className="mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>h1>
                        <p className="text-dark-400 mt-1">Welcome back, {user.name || "there"}!</p>p>
                </div>div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card"><p className="text-sm text-dark-400">Total Agents</p>p><p className="text-3xl font-bold mt-1">{agentCount}</p>p></div>div>
                        <div className="card"><p className="text-sm text-dark-400">Active Agents</p>p><p className="text-3xl font-bold mt-1 text-green-400">{activeAgents}</p>p></div>div>
                        <div className="card"><p className="text-sm text-dark-400">Conversations</p>p><p className="text-3xl font-bold mt-1">{totalConversations}</p>p></div>div>
                </div>div>
                <div className="card">
                        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Quick Actions</h2>h2></div>div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Link href="/dashboard/agents/new" className="flex items-center space-x-3 p-4 rounded-lg border border-dark-600 hover:border-primary-500 hover:bg-dark-800 transition-colors"><div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center"><span className="text-primary-400 text-xl">+</span>span></div>div><div><p className="font-medium">Create New Agent</p>p><p className="text-sm text-dark-400">Build a new AI agent from scratch</p>p></div>div></Link>Link>
                                  <Link href="/dashboard/agents" className="flex items-center space-x-3 p-4 rounded-lg border border-dark-600 hover:border-primary-500 hover:bg-dark-800 transition-colors"><div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center"><span className="text-dark-300 text-xl">&#8594;</span>span></div>div><div><p className="font-medium">View All Agents</p>p><p className="text-sm text-dark-400">Manage your existing agents</p>p></div>div></Link>Link>
                        </div>div>
                </div>div>
          </div>div>
        );
}</div>
