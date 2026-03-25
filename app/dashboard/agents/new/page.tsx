"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function NewAgentPage() {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
        const [form, setForm] = useState({ name: "", description: "", systemPrompt: "", model: "gpt-4", temperature: 0.7, maxTokens: 2048 });
          async function handleSubmit(e: React.FormEvent) {
              e.preventDefault(); setLoading(true); setError("");
                  try {
                        const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
                              const data = await res.json();
                                    if (!res.ok) throw new Error(data.error || "Failed to create agent");
                                          router.push("/dashboard/agents");
                                              } catch (err: any) { setError(err.message); } finally { setLoading(false); }
                                                }
                                                  return (
                                                      <div className="p-8 max-w-3xl">
                                                            <div className="mb-8"><Link href="/dashboard/agents" className="text-sm text-dark-400 hover:text-white">&larr; Back to Agents</Link><h1 className="text-3xl font-bold mt-2">Create New Agent</h1></div>
                                                                  <form onSubmit={handleSubmit} className="space-y-6">
                                                                          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
                                                                                  <div className="card space-y-4">
                                                                                            <h2 className="text-lg font-semibold">Basic Info</h2>
                                                                                                      <div><label className="block text-sm font-medium mb-1">Agent Name *</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field w-full" placeholder="My Assistant" required /></div>
                                                                                                                <div><label className="block text-sm font-medium mb-1">Description</label><input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field w-full" placeholder="What does this agent do?" /></div>
                                                                                                                          <div><label className="block text-sm font-medium mb-1">System Prompt *</label><textarea value={form.systemPrompt} onChange={(e) => setForm({...form, systemPrompt: e.target.value})} className="input-field w-full h-32 resize-none" placeholder="You are a helpful assistant..." required /></div>
                                                                                                                                  </div>
                                                                                                                                          <div className="card space-y-4">
                                                                                                                                                    <h2 className="text-lg font-semibold">Model Settings</h2>
                                                                                                                                                              <div><label className="block text-sm font-medium mb-1">Model</label><select value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} className="input-field w-full"><option value="gpt-4">GPT-4</option><option value="gpt-3.5-turbo">GPT-3.5 Turbo</option><option value="claude-3-opus">Claude 3 Opus</option><option value="claude-3-sonnet">Claude 3 Sonnet</option></select></div>
                                                                                                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                                                                                                                    <div><label className="block text-sm font-medium mb-1">Temperature: {form.temperature}</label><input type="range" min="0" max="2" step="0.1" value={form.temperature} onChange={(e) => setForm({...form, temperature: parseFloat(e.target.value)})} className="w-full" /></div>
                                                                                                                                                                                                <div><label className="block text-sm font-medium mb-1">Max Tokens</label><input type="number" value={form.maxTokens} onChange={(e) => setForm({...form, maxTokens: parseInt(e.target.value)})} className="input-field w-full" min="1" max="32000" /></div>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                          <div className="flex items-center space-x-4">
                                                                                                                                                                                                                                    <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? "Creating..." : "Create Agent"}</button>
                                                                                                                                                                                                                                              <Link href="/dashboard/agents" className="btn-secondary">Cancel</Link>
                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                            </form>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                  }
