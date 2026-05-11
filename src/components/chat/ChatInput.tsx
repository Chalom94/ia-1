"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Paperclip,
  Square,
  Mic,
  Globe,
  X,
  FileText,
  Image,
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn, formatFileSize } from "@/lib/utils";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, stopStreaming, isStreaming } = useChat();

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  const handleSubmit = async () => {
    if ((!input.trim() && files.length === 0) || isStreaming) return;
    const message = input.trim();
    setInput("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = (input.trim().length > 0 || files.length > 0) && !isStreaming;

  return (
    <div className="px-4 pb-6 pt-2">
      <div className="max-w-3xl mx-auto">
        {/* File Previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-2 px-1"
            >
              {files.map((file, i) => (
                <FilePreview key={i} file={file} onRemove={() => removeFile(i)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div className={cn(
          "relative flex flex-col rounded-2xl",
          "bg-card border border-border shadow-lg shadow-black/10",
          "transition-all duration-200",
          "focus-within:border-primary/40 focus-within:shadow-primary/10 focus-within:shadow-xl"
        )}>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Platform..."
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent px-4 pt-4 pb-2",
              "text-sm text-foreground placeholder:text-muted-foreground/60",
              "outline-none leading-relaxed",
              "scrollbar-none"
            )}
            style={{ maxHeight: "200px" }}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-1">
              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.md,.json,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <ToolButton
                icon={<Paperclip className="w-4 h-4" />}
                label="Attach file"
                onClick={() => fileInputRef.current?.click()}
              />
              <ToolButton icon={<Globe className="w-4 h-4" />} label="Search web" />
              <ToolButton icon={<Mic className="w-4 h-4" />} label="Voice input" />
            </div>

            <div className="flex items-center gap-2">
              {input.length > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-muted-foreground/50"
                >
                  {input.length}
                </motion.span>
              )}

              {isStreaming ? (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={stopStreaming}
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center",
                    "bg-foreground text-background hover:bg-foreground/90",
                    "transition-all duration-150"
                  )}
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center",
                    "transition-all duration-200",
                    canSubmit
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:shadow-primary/50 hover:brightness-110"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-3">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
    >
      {icon}
    </button>
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent border border-border text-sm max-w-[200px]"
    >
      <div className="text-primary flex-shrink-0">
        {isImage ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-xs font-medium truncate">{file.name}</p>
        <p className="text-muted-foreground text-[10px]">{formatFileSize(file.size)}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
