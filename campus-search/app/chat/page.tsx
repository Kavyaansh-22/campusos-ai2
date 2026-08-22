"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sendChatMessage, type ChatResponse } from "@/lib/chatClient";

type Message = { role: "user" | "assistant"; content: string; sources?: ChatResponse["sources"] };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your CampusOS Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the server right now." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex w-full flex-1 flex-col items-center p-4 sm:p-8">
        <div className="flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-paper-raised shadow-sm">
          
          {/* Chat Header */}
          <div className="border-b border-border bg-paper px-6 py-4">
            <h1 className="font-display text-xl font-semibold text-ink">Campus Assistant</h1>
            <p className="text-sm text-slate-light">Powered by AI</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-base ${
                    msg.role === "user" ? "bg-ink text-white" : "bg-paper text-ink border border-border"
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* Source Links */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 pl-2">
                    {msg.sources.map((src, i) => {
                      const pluralCategory = src.type.endsWith('y') ? src.type.replace('y', 'ies') : src.type + 's';
                      return (
                        <Link 
                          key={i} 
                          href={`/${pluralCategory}/${src.id}`}
                          className="rounded-full border border-border bg-paper px-3 py-1 text-xs text-slate hover:border-slate-light hover:text-ink transition-colors"
                        >
                          🔗 {src.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="max-w-[80%] animate-pulse rounded-2xl border border-border bg-paper px-5 py-3 text-base text-slate">
                  Searching campus records...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="border-t border-border bg-paper p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the campus..."
                className="flex-1 rounded-xl border border-border bg-paper px-4 py-3 outline-none focus:border-ink"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-ink px-6 py-3 font-medium text-white transition-opacity disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
}