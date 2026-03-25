"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e: React.FormEvent) {
          e.preventDefault(); setLoading(true); setError("");
          try {
                  const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Registration failed");
                  router.push("/dashboard");
                } catch (err: any) { setError(err.message); } finally { setLoading(false); }
        }
    return (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center space-x-2"><div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold">AF</span></div><span className="text-2xl font-bold">AgentForge</span></Link>
                <h1 className="text-2xl font-bold mt-6">Create your account</h1>
                <p className="text-dark-400 mt-2">Start building AI agents in minutes</p>
              </div>
              <form onSubmit={handleSubmit} className="card space-y-4">
                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
                <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" placeholder="Your name" /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" placeholder="you@example.com" required /></div>
                <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full" placeholder="Min 8 characters" required minLength={8} /></div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? "Creating account..." : "Create Account"}</button>
                <p className="text-center text-sm text-dark-400">Already have an account? <Link href="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link></p>
              </form>
            </div>
          </div>
        );
  }
