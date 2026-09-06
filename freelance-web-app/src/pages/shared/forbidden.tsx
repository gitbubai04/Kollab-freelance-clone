import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function ForbiddenPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--brand-page-bg)] px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50">
        <Lock className="size-7 text-amber-600" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">You don&apos;t have permission to access this page</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your current account role does not hold authorization to view this resource. If you believe this is in
        error, contact your workspace administrator.
      </p>

      <div className="mt-6 w-full max-w-md space-y-1 rounded-xl border border-border bg-white p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Active identity</span>
          <span className="font-medium text-slate-900">{user?.email ?? "unauthenticated"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current role</span>
          <span className="font-medium text-slate-900">{user?.role ?? "none"}</span>
        </div>
      </div>

      <Button asChild className="mt-6">
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
