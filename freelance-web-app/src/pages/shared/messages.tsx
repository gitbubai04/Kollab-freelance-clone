import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThreadMessages, useThreads } from "@/hooks/use-messages";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MessagesPage() {
  const { data: threads } = useThreads();
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);
  const activeThread = threads?.find((t) => t.id === activeThreadId) ?? threads?.[0];
  const { data: messages } = useThreadMessages(activeThread?.id);
  const [draft, setDraft] = useState("");

  return (
    <div className="grid h-[calc(100svh-8.5rem)] grid-cols-[280px_1fr] overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-y-auto border-r border-border">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-slate-900">Direct Threads</h2>
        </div>
        {threads?.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveThreadId(thread.id)}
            className={cn(
              "flex w-full items-start gap-3 border-b border-border p-4 text-left hover:bg-slate-50",
              (activeThread?.id === thread.id) && "bg-blue-50/60",
            )}
          >
            <Avatar>
              <AvatarFallback>{initials(thread.participantName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-slate-900">{thread.participantName}</p>
                <span className="text-xs text-muted-foreground">{thread.lastActivityAt}</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{thread.projectTitle}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{thread.lastMessagePreview}</p>
            </div>
            {thread.unreadCount > 0 && (
              <Badge className="h-5 min-w-5 justify-center bg-blue-600 px-1 text-[11px]">{thread.unreadCount}</Badge>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {activeThread ? (
          <>
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeThread.participantName}</p>
                <p className="text-xs text-muted-foreground">{activeThread.projectTitle}</p>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages?.map((message) => (
                <div key={message.id} className={cn("flex", message.senderIsSelf ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-md rounded-2xl px-4 py-2.5 text-sm",
                      message.senderIsSelf ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900",
                    )}
                  >
                    {message.content}
                    <p className={cn("mt-1 text-[10px]", message.senderIsSelf ? "text-slate-300" : "text-slate-500")}>
                      {message.sentAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex items-center gap-2 border-t border-border p-4"
              onSubmit={(e) => {
                e.preventDefault();
                setDraft("");
              }}
            >
              <Input
                placeholder={`Write a message to ${activeThread.participantName}...`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button type="submit" size="icon" disabled={!draft}>
                <Send className="size-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
