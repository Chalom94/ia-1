"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  children: string;
  className?: string;
}

export function CodeBlock({ language = "text", children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = language === "text" ? "" : language;

  return (
    <div className={cn("group relative my-4 rounded-xl overflow-hidden border border-white/10", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1b26] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            {displayLanguage || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/50 hover:text-white/90 hover:bg-white/10 transition-all duration-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#13141f",
          padding: "1.25rem 1rem",
          fontSize: "0.8125rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={children.split("\n").length > 5}
        lineNumberStyle={{
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.75rem",
          minWidth: "2.5rem",
          paddingRight: "1rem",
        }}
        wrapLongLines={false}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
