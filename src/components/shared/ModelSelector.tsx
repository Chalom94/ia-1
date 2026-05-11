"use client";

import { ChevronDown, Zap, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { MODELS, type AIModel } from "@/types";
import { cn } from "@/lib/utils";

export function ModelSelector() {
  const { settings, updateSettings } = useChatStore();
  const [open, setOpen] = useState(false);

  const currentModel = MODELS.find((m) => m.id === settings.model) ?? MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-all duration-200 border border-transparent hover:border-border"
        )}
      >
        <span>{currentModel.name}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute bottom-full left-0 mb-2 w-72 z-40",
                "bg-popover border border-border rounded-xl shadow-2xl overflow-hidden",
                "backdrop-blur-xl"
              )}
            >
              <div className="p-1.5">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      updateSettings({ model: model.id });
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                      "hover:bg-accent transition-colors duration-150",
                      settings.model === model.id && "bg-accent"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      model.provider === "anthropic" ? "bg-orange-500/15" : "bg-green-500/15"
                    )}>
                      {model.provider === "anthropic" ? (
                        <Brain className="w-4 h-4 text-orange-400" />
                      ) : (
                        <Zap className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{model.name}</span>
                        {model.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
                    </div>
                    {settings.model === model.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
