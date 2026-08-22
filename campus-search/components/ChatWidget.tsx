"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendChatMessage, type ChatResponse } from "@/lib/chatClient";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/types";

type Message = { role: "user" | "assistant"; content: string; sources?: ChatResponse["sources"] };

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your CampusOS Assistant. Ask me anything about buildings, faculty, labs, or offices!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4 flex h-[500px] w-[350px] flex-col rounded-2xl border border-border bg-paper-raised shadow-xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-paper px-4 py-3">
            <h3 className="font-display font-semibold text-ink">Campus Assistant</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user" ? "bg-ink text-white" : "bg-paper text-ink border border-border"
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* Sources Chips */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                    {msg.sources.map((src, i) => {
                      // Safety mapping: Python backend sends 'facility', but UI expects 'facilities'
                      const pluralCategory = src.type.endsWith('y') ? src.type.replace('y', 'ies') : src.type + 's';
                      return (
                        <Link 
                          key={i} 
                          href={`/${pluralCategory}/${src.id}`}
                          className="rounded-full border border-border bg-paper px-2 py-0.5 text-[10px] text-slate-light hover:border-slate hover:text-ink transition-colors"
                        >
                          {src.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="max-w-[85%] rounded-2xl bg-paper border border-border px-4 py-2 text-sm text-slate animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a building, lab, or faculty..."
              className="w-full rounded-xl border border-border bg-paper px-4 py-2 text-sm outline-none focus:border-ink"
              disabled={isLoading}
            />
          </form>
        </div>
      )}
    </div>
  );
}