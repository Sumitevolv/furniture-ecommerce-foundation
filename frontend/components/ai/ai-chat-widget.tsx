"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/ai-service";
import { publicEnv } from "@/lib/env";
import type { AiChatMessage } from "@/types/ai";
import { cn } from "@/lib/utils";

/**
 * Floating "design assistant" entry point. All AI reasoning happens
 * server-side (see backend Integrations/OpenAiService.cs) — this component
 * only sends the user's message and conversation id, and renders the reply.
 */
export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I can help you find the right piece for your space. What are you furnishing today?",
      createdAt: new Date().toISOString(),
    },
  ]);

  if (!publicEnv.enableAiFeatures) return null;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await aiService.chat({ message: trimmed, conversationId });
      setConversationId(response.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't reach the design assistant just now. Please try again shortly.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open design assistant"
        className={cn(
          "fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-30 flex h-[32rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-md border border-border-subtle bg-surface shadow-2xl"
            role="dialog"
            aria-label="Design assistant chat"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <p className="font-serif text-sm text-text-primary">Design Assistant</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-md px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-charcoal text-ivory"
                      : "bg-surface-muted text-text-primary"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isSending && <p className="text-xs text-text-muted">Thinking…</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 border-t border-border-subtle p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a room, style, or piece…"
                aria-label="Message"
                className="h-10"
              />
              <Button type="submit" size="icon" aria-label="Send message" isLoading={isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
