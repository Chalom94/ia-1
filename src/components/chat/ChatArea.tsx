"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { ChatMessage } from "./ChatMessage";
import { WelcomeScreen } from "./WelcomeScreen";

export function ChatArea() {
  const { activeConversation } = useChatStore();
  const conversation = activeConversation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  if (!conversation || conversation.messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin"
    >
      <div className="max-w-3xl mx-auto py-4">
        <AnimatePresence initial={false}>
          {conversation.messages.map((message, idx) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={idx === conversation.messages.length - 1}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
