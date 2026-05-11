import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Conversation, Message, AIModel, ChatSettings, UserProfile } from "@/types";
import { generateTitle } from "@/lib/utils";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  sidebarOpen: boolean;
  settings: ChatSettings;
  user: UserProfile;
  isStreaming: boolean;

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  pinConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => string;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  finalizeMessage: (conversationId: string, messageId: string) => void;
  clearMessages: (conversationId: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setIsStreaming: (streaming: boolean) => void;

  // Computed
  activeConversation: () => Conversation | null;
}

const DEFAULT_SETTINGS: ChatSettings = {
  model: "claude-3-5-sonnet",
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: "You are a helpful, harmless, and honest AI assistant.",
  streamingEnabled: true,
};

const DEFAULT_USER: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  plan: "pro",
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      sidebarOpen: true,
      settings: DEFAULT_SETTINGS,
      user: DEFAULT_USER,
      isStreaming: false,

      createConversation: () => {
        const id = uuidv4();
        const conversation: Conversation = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: get().settings.model,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const remaining = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: remaining,
            activeConversationId:
              state.activeConversationId === id
                ? remaining[0]?.id ?? null
                : state.activeConversationId,
          };
        });
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }));
      },

      pinConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        }));
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId, messageData) => {
        const id = uuidv4();
        const message: Message = {
          id,
          createdAt: new Date(),
          ...messageData,
        };
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            const title =
              c.title === "New Chat" && messageData.role === "user"
                ? generateTitle(messageData.content)
                : c.title;
            return { ...c, messages, title, updatedAt: new Date() };
          }),
        }));
        return id;
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
            };
          }),
        }));
      },

      finalizeMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, isStreaming: false } : m
              ),
            };
          }),
        }));
      },

      clearMessages: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, messages: [], updatedAt: new Date() } : c
          ),
        }));
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
      },

      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      activeConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        sidebarOpen: state.sidebarOpen,
        settings: state.settings,
        user: state.user,
      }),
    }
  )
);
