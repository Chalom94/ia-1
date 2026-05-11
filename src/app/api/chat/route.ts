import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Simulated AI response generator for demo purposes.
// Replace with real Anthropic/OpenAI API calls by adding API keys.
async function* generateMockStream(messages: ChatMessage[], systemPrompt: string) {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const userContent = lastUserMessage?.content ?? "";

  const response = await buildDemoResponse(userContent);
  const words = response.split(" ");

  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? " " : "");
    // Simulate realistic streaming delay
    await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30));
  }
}

function buildDemoResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("code") || lower.includes("react") || lower.includes("typescript")) {
    return `Here's a clean TypeScript React hook example:

\`\`\`typescript
import { useState, useEffect, useCallback } from 'react';

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage example
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery);
      // Call your search API here
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
\`\`\`

**Key features of this hook:**

- **Generic type support** — works with any value type
- **Configurable delay** — defaults to 300ms but fully customizable
- **Cleanup on unmount** — prevents memory leaks via \`useEffect\` cleanup
- **Minimal re-renders** — only triggers downstream effects when the debounced value settles

This pattern is essential for search inputs, auto-save features, and any real-time filtering UI.`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! I'm your AI assistant. I'm here to help you with:

- **Code** — Writing, debugging, reviewing in any language
- **Writing** — Drafts, editing, structuring content
- **Analysis** — Data, research, problem-solving
- **Brainstorming** — Ideas, strategy, creativity

What would you like to work on today?`;
  }

  if (lower.includes("startup") || lower.includes("idea") || lower.includes("business")) {
    return `Here are **10 innovative AI startup ideas** for 2025:

1. **AI-powered legal contract analyzer** — Automatically flag risks in contracts for SMBs
2. **Personalized learning path generator** — Adaptive curricula that evolve with the learner
3. **AI code reviewer for security** — Real-time vulnerability detection in CI/CD pipelines
4. **Multimodal customer support agent** — Handles voice, image, and text simultaneously
5. **AI-driven supply chain optimizer** — Predicts disruptions before they happen
6. **Mental health companion app** — CBT-guided conversations with therapist oversight
7. **Automated technical documentation** — Generates and keeps docs in sync with code
8. **AI meeting intelligence platform** — Transcribes, summarizes, and extracts action items
9. **Smart contract auditor** — Automated blockchain smart contract security analysis
10. **AI-powered UX researcher** — Synthesizes user interviews into actionable insights

Each of these targets a real pain point with a defensible AI moat. Want me to dive deeper into any of these?`;
  }

  if (lower.includes("explain") || lower.includes("how") || lower.includes("transformer")) {
    return `## How Transformers Work

Transformers are the architecture behind modern LLMs like GPT and Claude. Here's a clear breakdown:

### Core Concept: Attention

The key innovation is **self-attention** — every token can "look at" every other token:

\`\`\`
Input: "The cat sat on the mat"

For "cat", attention scores might be:
  "The" → 0.1
  "cat" → 0.5 (itself)
  "sat" → 0.3  (action)
  "mat" → 0.1
\`\`\`

### The Architecture

**1. Embedding Layer**
Convert tokens to dense vectors (e.g., 512 dimensions)

**2. Multi-Head Attention**
Run attention multiple times in parallel — each "head" learns different relationships (syntax, semantics, coreference, etc.)

**3. Feed-Forward Network**
Apply non-linear transformations to each position independently

**4. Layer Normalization + Residual Connections**
Stabilize training and allow gradients to flow through many layers

### Why It Works So Well

| Property | Benefit |
|----------|---------|
| Parallelizable | Trains 10–100x faster than RNNs |
| Long-range dependencies | Handles context windows of 200k+ tokens |
| Scalable | Performance improves predictably with scale |

The "magic" is that with enough parameters and data, transformers learn rich representations of language, code, and reasoning.`;
  }

  return `I understand you're asking about: *"${input.slice(0, 60)}${input.length > 60 ? "..." : ""}"*

That's a great question! Here's my thoughtful response:

**Key Points:**

- This topic involves several important considerations worth exploring carefully
- The most effective approach typically balances multiple perspectives
- Concrete examples help ground abstract concepts in practical reality

**Deeper Analysis:**

When we look at this from first principles, we can identify the core components that matter most. The framework I'd suggest involves:

1. **Understanding the context** — What constraints and goals are relevant?
2. **Mapping the solution space** — What are the viable approaches?
3. **Evaluating trade-offs** — What does each approach cost vs. deliver?
4. **Iterating toward clarity** — Refine based on new information

Is there a specific aspect you'd like me to explore further? I'm happy to go deeper on any dimension of this.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, systemPrompt = "You are a helpful AI assistant." } = body;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateMockStream(messages, systemPrompt)) {
            const data = JSON.stringify({ content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          const errData = JSON.stringify({ error: "Stream error" });
          controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
