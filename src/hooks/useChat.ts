"use client";

import { useCallback, useRef } from "react";
import { useChatStore } from "@/store/chatStore";

export function useChat() {
  const {
    activeConversationId,
    createConversation,
    addMessage,
    updateMessage,
    finalizeMessage,
    setIsStreaming,
    isStreaming,
    settings,
  } = useChatStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (!content.trim() || isStreaming) return;

      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = createConversation();
      }

      // Add user message
      addMessage(conversationId, {
        role: "user",
        content: content.trim(),
      });

      // Add streaming assistant message placeholder
      const assistantMessageId = addMessage(conversationId, {
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      try {
        const store = useChatStore.getState();
        const conversation = store.conversations.find((c) => c.id === conversationId);
        const messages = conversation?.messages
          .filter((m) => !m.isStreaming)
          .map((m) => ({ role: m.role, content: m.content })) ?? [];

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            messages,
            model: settings.model,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            systemPrompt: settings.systemPrompt,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  updateMessage(conversationId!, assistantMessageId, accumulatedContent);
                }
              } catch {
                // ignore parse errors for partial chunks
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          updateMessage(
            conversationId!,
            assistantMessageId,
            "I apologize, but I encountered an error. Please try again."
          );
        }
      } finally {
        finalizeMessage(conversationId!, assistantMessageId);
        setIsStreaming(false);
      }
    },
    [
      activeConversationId,
      createConversation,
      addMessage,
      updateMessage,
      finalizeMessage,
      setIsStreaming,
      isStreaming,
      settings,
    ]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, [setIsStreaming]);

  return { sendMessage, stopStreaming, isStreaming };
}
