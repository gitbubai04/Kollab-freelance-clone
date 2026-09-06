import { useQuery } from "@tanstack/react-query";
import { getMessagesByThread, getThreads } from "@/api/messages";

export function useThreads() {
  return useQuery({ queryKey: ["threads"], queryFn: getThreads });
}

export function useThreadMessages(threadId: string | undefined) {
  return useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => getMessagesByThread(threadId as string),
    enabled: !!threadId,
  });
}
