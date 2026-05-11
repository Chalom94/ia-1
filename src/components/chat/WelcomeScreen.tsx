"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, BookOpen, Lightbulb, Wand2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  {
    icon: <Code2 className="w-4 h-4" />,
    label: "Write code",
    prompt: "Write a React hook for debouncing user input with TypeScript",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-400",
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Brainstorm",
    prompt: "Give me 10 innovative startup ideas in the AI space for 2025",
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20 hover:border-yellow-500/40",
    iconColor: "text-yellow-400",
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Explain",
    prompt: "Explain how transformers work in machine learning, with clear examples",
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    label: "Create",
    prompt: "Write a compelling product landing page copy for a SaaS analytics tool",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/20 hover:border-pink-500/40",
    iconColor: "text-pink-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export function WelcomeScreen() {
  const { sendMessage } = useChat();

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Logo + Title */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-violet-600 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-violet-600 blur-xl opacity-40"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            How can I help you today?
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Ask me anything — code, writing, analysis, math, or just have a conversation.
          </p>
        </motion.div>

        {/* Suggestion Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {SUGGESTIONS.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => sendMessage(item.prompt)}
              className={cn(
                "flex flex-col gap-3 p-4 rounded-2xl text-left",
                "bg-gradient-to-br border transition-all duration-200",
                "hover:shadow-lg hover:shadow-black/20",
                item.color
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center",
                "bg-black/20 backdrop-blur-sm",
                item.iconColor
              )}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
