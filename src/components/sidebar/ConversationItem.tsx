"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import type { Conversation } from "@/types";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { deleteConversation, renameConversation, pinConversation } = useChatStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRename = () => {
    if (editTitle.trim()) {
      renameConversation(conversation.id, editTitle.trim());
    }
    setIsEditing(false);
    setMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") {
      setEditTitle(conversation.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer",
        "transition-all duration-150",
        isActive
          ? "bg-sidebar-active text-foreground"
          : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
      )}
      onClick={!isEditing ? onClick : undefined}
    >
      <MessageSquare className={cn(
        "w-4 h-4 flex-shrink-0 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground/60"
      )} />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none border-b border-primary/60 text-foreground"
          />
          <button onClick={handleRename} className="p-0.5 hover:text-primary">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setEditTitle(conversation.title); setIsEditing(false); }}
            className="p-0.5 hover:text-destructive"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-sm truncate">{conversation.title}</span>

          {conversation.pinned && (
            <Pin className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
          )}

          <div className={cn(
            "flex-shrink-0 transition-opacity duration-150",
            menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* Dropdown Menu */}
      {menuOpen && !isEditing && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute right-1 top-8 w-48 z-40 py-1",
              "bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              icon={<Pencil className="w-3.5 h-3.5" />}
              label="Rename"
              onClick={() => { setIsEditing(true); setMenuOpen(false); setTimeout(() => inputRef.current?.focus(), 50); }}
            />
            <MenuItem
              icon={conversation.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              label={conversation.pinned ? "Unpin" : "Pin"}
              onClick={() => { pinConversation(conversation.id); setMenuOpen(false); }}
            />
            <div className="my-1 border-t border-border" />
            <MenuItem
              icon={<Trash2 className="w-3.5 h-3.5" />}
              label="Delete"
              variant="danger"
              onClick={() => { deleteConversation(conversation.id); setMenuOpen(false); }}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
        variant === "danger"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-accent"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
