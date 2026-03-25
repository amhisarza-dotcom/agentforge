import Link from "next/link";
export default function Home() {
  return (
      <main className="min-h-screen">
            <nav className="border-b border-dark-700 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">AF</span></div>
                                                      <span className="text-xl font-bold">AgentForge</span>
                                                                </div>
                                                                          <div className="flex items-center space-x-4">
                                                                                      <Link href="/login" className="btn-secondary">Log in</Link>
                                                                                                  <Link href="/register" className="btn-primary">Get Started</Link>
                                                                                                            </div>
                                                                                                                    </div>
                                                                                                                          </nav>
                                                                                                                                <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                                                                                                                                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">Build Intelligent AI Agents</h1>
                                                                                                                                                <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">Design, train, and deploy powerful AI agents. No complex setup required.</p>
                                                                                                                                                        <div className="flex items-center justify-center space-x-4">
                                                                                                                                                                  <Link href="/register" className="btn-primary text-lg px-8 py-3">Start Building Free</Link>
                                                                                                                                                                            <Link href="/docs" className="btn-secondary text-lg px-8 py-3">Documentation</Link>
                                                                                                                                                                                    </div>
                                                                                                                                                                                          </section>
                                                                                                                                                                                                <section className="max-w-7xl mx-auto px-6 py-20">
                                                                                                                                                                                                        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to build AI agents</h2>
                                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                                                                                          <div className="card"><h3 className="text-xl font-semibold mb-2">Visual Agent Builder</h3><p className="text-dark-300">Design agent workflows visually.</p></div>
                                                                                                                                                                                                                                    <div className="card"><h3 className="text-xl font-semibold mb-2">Multi-Model Support</h3><p className="text-dark-300">Connect to GPT-4, Claude, Gemini, and more.</p></div>
                                                                                                                                                                                                                                              <div className="card"><h3 className="text-xl font-semibold mb-2">Tool Integration</h3><p className="text-dark-300">Equip agents with API calls, web search, and code execution.</p></div>
                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                            </section>
                                                                                                                                                                                                                                                                  <footer className="border-t border-dark-700 px-6 py-8 mt-20"><div className="max-w-7xl mx-auto text-center text-dark-400">Built with AgentForge</div></footer>
                                                                                                                                                                                                                                                                      </main>
                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                        }
