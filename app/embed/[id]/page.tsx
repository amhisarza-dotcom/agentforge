"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function EmbedChatPage({ params }: { params: { id: string } }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [agentName, setAgentName] = useState("AI Assistant");
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
        fetch(`/api/embed/${params.id}/info`).then(r => r.json()).then(d => {
                if (d.name) setAgentName(d.name);
        }).catch(() => {});
  }, [params.id]);

  useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        try {
                const res = await fetch(`/api/embed/${params.id}/chat`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ message: input }),
                });
                const data = await res.json();
                if (res.ok) {
                          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.response }]);
                }
        } catch {}
        setLoading(false);
  };

  return (
        <div className="fixed bottom-4 right-4 z-50">
          {!isOpen && (
                  <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>svg>
                  </button>button>
              )}
          {isOpen && (
                  <div className="w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
                                        <div><h3 className="font-semibold">{agentName}</h3>h3><p className="text-xs opacity-80">Powered by AgentForge</p>p></div>div>
                                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>svg></button>button>
                            </div>div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                              {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-8">Send a message to start chatting</p>p>}
                              {messages.map(msg => (
                                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
                                                    {msg.content}
                                                  </div>div>
                                  </div>div>
                                ))}
                              {loading && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl"><span className="animate-pulse">...</span>span></div>div></div>div>}
                                        <div ref={messagesEndRef} />
                            </div>div>
                            <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                                        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Send</button>button>
                            </form>form>
                  </div>div>
              )}
        </div>div>
      );
}</div>
