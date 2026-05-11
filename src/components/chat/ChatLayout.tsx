"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "./ChatArea";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatHeader />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <ChatArea />

          {/* Input */}
          <ChatInput />
        </div>
      </main>
    </div>
  );
}
