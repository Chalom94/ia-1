"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Sparkles, User } from "lucide-react";
import type { Message } from "@/types";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { TypingIndicator } from "@/components/shared/TypingIndicator";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"up" | "down" | null>(null);

  const isUser = message.role === "user";
  const isEmpty = !message.content && message.isStreaming;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group flex gap-4 px-4 py-5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/20"
          : "bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[78%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-500/20"
            : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
        )}>
          {isEmpty ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {message.isStreaming && !isEmpty && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-current ml-0.5 align-text-bottom rounded-full"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {/* Actions (assistant only, after streaming) */}
        {!isUser && !message.isStreaming && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ActionButton
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              label="Copy"
              onClick={handleCopy}
            />
            <ActionButton
              icon={<ThumbsUp className={cn("w-3.5 h-3.5", liked === "up" && "text-emerald-400 fill-emerald-400")} />}
              label="Good response"
              onClick={() => setLiked(liked === "up" ? null : "up")}
            />
            <ActionButton
              icon={<ThumbsDown className={cn("w-3.5 h-3.5", liked === "down" && "text-red-400 fill-red-400")} />}
              label="Bad response"
              onClick={() => setLiked(liked === "down" ? null : "down")}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
    >
      {icon}
    </button>
  );
}
