export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
  attachments?: Attachment[];
  tokens?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: AIModel;
  pinned?: boolean;
}

export type AIModel = "claude-3-5-sonnet" | "claude-3-opus" | "gpt-4o" | "gpt-4o-mini";

export interface ModelInfo {
  id: AIModel;
  name: string;
  provider: "anthropic" | "openai";
  description: string;
  contextLength: number;
  badge?: string;
}

export const MODELS: ModelInfo[] = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    description: "Most intelligent model",
    contextLength: 200000,
    badge: "Smart",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Powerful for complex tasks",
    contextLength: 200000,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Multimodal flagship model",
    contextLength: 128000,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable",
    contextLength: 128000,
    badge: "Fast",
  },
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "team";
}

export interface ChatSettings {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  streamingEnabled: boolean;
}

export interface ConversationGroup {
  label: string;
  conversations: Conversation[];
}
