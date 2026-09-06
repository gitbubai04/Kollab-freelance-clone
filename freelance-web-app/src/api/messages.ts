import { simulateRequest } from "@/api/mock-utils";
import { mockMessages, mockThreads } from "@/lib/mock-data";
import type { Message, MessageThread } from "@/types";

export async function getThreads(): Promise<MessageThread[]> {
  return simulateRequest(mockThreads);
}

export async function getMessagesByThread(threadId: string): Promise<Message[]> {
  return simulateRequest(mockMessages.filter((m) => m.threadId === threadId));
}
