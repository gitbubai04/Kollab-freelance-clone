import { Bell, CheckCheck, MessageSquare, Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  escrow: <ShieldCheck className="size-4 text-emerald-600" />,
  proposal: <Bell className="size-4 text-blue-600" />,
  system: <Settings2 className="size-4 text-slate-600" />,
  message: <MessageSquare className="size-4 text-blue-600" />,
};

export function NotificationsPage() {
  const { data: notifications } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stay updated on proposals, contracts, escrow releases, and messages.</p>
        </div>
        <Button variant="outline">
          <CheckCheck className="size-4" /> Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications?.map((notification) => (
          <Card key={notification.id} className={cn(!notification.read && "border-blue-200 bg-blue-50/30")}>
            <CardContent className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-border">
                {ICONS[notification.category]}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{notification.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                  {notification.actionLabel && (
                    <button className="text-xs font-medium text-blue-600 hover:underline">{notification.actionLabel}</button>
                  )}
                </div>
              </div>
              {!notification.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-600" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
