import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import type { Conversation, ConversationGroup } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return formatDistanceToNow(date, { addSuffix: true });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function groupConversationsByDate(conversations: Conversation[]): ConversationGroup[] {
  const pinned = conversations.filter((c) => c.pinned);
  const unpinned = conversations.filter((c) => !c.pinned);

  const today = unpinned.filter((c) => isToday(c.updatedAt));
  const yesterday = unpinned.filter((c) => isYesterday(c.updatedAt));
  const thisWeek = unpinned.filter(
    (c) => isThisWeek(c.updatedAt) && !isToday(c.updatedAt) && !isYesterday(c.updatedAt)
  );
  const older = unpinned.filter((c) => !isThisWeek(c.updatedAt));

  const groups: ConversationGroup[] = [];
  if (pinned.length > 0) groups.push({ label: "Pinned", conversations: pinned });
  if (today.length > 0) groups.push({ label: "Today", conversations: today });
  if (yesterday.length > 0) groups.push({ label: "Yesterday", conversations: yesterday });
  if (thisWeek.length > 0) groups.push({ label: "This Week", conversations: thisWeek });
  if (older.length > 0) groups.push({ label: "Older", conversations: older });

  return groups;
}

export function generateTitle(content: string): string {
  const cleaned = content.replace(/[^\w\s]/g, "").trim();
  const words = cleaned.split(/\s+/).slice(0, 6);
  return words.join(" ") || "New Chat";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
