"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Settings,
  ChevronLeft,
  Sparkles,
  Crown,
  LogOut,
  X,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ConversationItem } from "./ConversationItem";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { groupConversationsByDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    setSidebarOpen,
    createConversation,
    setActiveConversation,
    user,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const groups = groupConversationsByDate(filtered);

  const handleNewChat = () => {
    createConversation();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto",
          "flex flex-col h-full overflow-hidden",
          "bg-sidebar-bg border-r border-sidebar-border"
        )}
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-foreground">AI Platform</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-hover text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3 mb-3">
            <button
              onClick={handleNewChat}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
                "bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/30",
                "text-primary text-sm font-medium",
                "transition-all duration-200 group"
              )}
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
              New Chat
            </button>
          </div>

          {/* Search */}
          <div className="px-3 mb-2">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sidebar-hover border border-border"
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground/60"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-all duration-150"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search chats...</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 space-y-4 scrollbar-thin">
            <AnimatePresence>
              {groups.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <MessageSquareIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground/50">
                    {searchQuery ? "No conversations found" : "No conversations yet"}
                  </p>
                </motion.div>
              ) : (
                groups.map((group) => (
                  <div key={group.label}>
                    <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.conversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isActive={conv.id === activeConversationId}
                          onClick={() => setActiveConversation(conv.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-all duration-150">
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sidebar-hover transition-all duration-150 cursor-pointer group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  {user.plan === "pro" && (
                    <Crown className="w-3 h-3 text-amber-400" />
                  )}
                  <span className="text-[11px] text-muted-foreground capitalize">{user.plan}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ThemeToggle className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
