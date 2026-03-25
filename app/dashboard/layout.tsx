import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
          <div className="min-h-screen flex">
            <aside className="w-64 border-r border-dark-700 bg-dark-950 flex flex-col">
              <div className="p-4 border-b border-dark-700">
                <Link href="/dashboard" className="flex items-center space-x-2"><div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">AF</span></div><span className="text-lg font-bold">AgentForge</span></Link>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-300 hover:text-white">Dashboard</Link>
                <Link href="/dashboard/agents" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-300 hover:text-white">Agents</Link>
                <Link href="/dashboard/settings" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-300 hover:text-white">Settings</Link>
              </nav>
              <div className="p-4 border-t border-dark-700">
                <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                <p className="text-xs text-dark-400 truncate">{user.email}</p>
              </div>
            </aside>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        );
}
