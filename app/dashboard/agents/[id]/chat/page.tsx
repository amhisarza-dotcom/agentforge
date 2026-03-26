"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function AgentChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState("Agent");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/agents/${params.id}`).then(r => r.json()).then(d => setAgentName(d.name || "Agent"));
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${params.id}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: input }) });
      const data = await res.json();
      if (res.ok) {
        const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: data.response, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error. Please try again.", createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, errMsg]);
      }
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "Connection error. Please check your network.", createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, errMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/agents/${params.id}`} className="text-dark-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{agentName}</h1>
            <p className="text-xs text-dark-400">Chat Testing</p>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="text-sm text-dark-400 hover:text-white">Clear Chat</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-dark-900 rounded-lg">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-dark-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <p>Start a conversation with {agentName}</p>
              <p className="text-sm mt-1">Type a message below to begin testing</p>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-dark-800 text-dark-200 rounded-bl-sm"}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-primary-200" : "text-dark-500"}`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1"><span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></span><span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="input-field flex-1" disabled={loading} autoFocus />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-6">Send</button>
      </form>
    </div>
  );
}
