"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn("prose-content", className)}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = String(children).includes("\n");

          if (isBlock || match) {
            return (
              <CodeBlock language={match?.[1] ?? "text"}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded-md text-[0.8125rem] font-mono bg-white/10 dark:bg-white/10 text-current border border-white/10"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-semibold mt-5 mb-2.5 first:mt-0">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0">{children}</h3>;
        },
        ul({ children }) {
          return <ul className="mb-4 pl-5 space-y-1.5 list-disc marker:text-white/40">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-4 pl-5 space-y-1.5 list-decimal marker:text-white/40">{children}</ol>;
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="my-4 pl-4 border-l-2 border-white/30 text-foreground/70 italic">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-white/5">{children}</thead>;
        },
        th({ children }) {
          return (
            <th className="px-4 py-3 text-left font-semibold text-sm border-b border-white/10">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-4 py-3 border-b border-white/5 text-foreground/80">
              {children}
            </td>
          );
        },
        hr() {
          return <hr className="my-6 border-white/10" />;
        },
        strong({ children }) {
          return <strong className="font-semibold">{children}</strong>;
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
