"use client";

import { motion } from "framer-motion";
import { Menu, Sparkles, Trash2, Share2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ModelSelector } from "@/components/shared/ModelSelector";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

export function ChatHeader() {
  const { sidebarOpen, toggleSidebar, activeConversation, clearMessages } = useChatStore();
  const conversation = activeConversation();

  return (
    <header className={cn(
      "flex items-center justify-between h-14 px-4",
      "border-b border-border bg-background/80 backdrop-blur-xl",
      "sticky top-0 z-10"
    )}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </motion.button>

        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">AI Platform</span>
          </motion.div>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center">
        <ModelSelector />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {conversation && conversation.messages.length > 0 && (
          <>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => clearMessages(conversation.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
