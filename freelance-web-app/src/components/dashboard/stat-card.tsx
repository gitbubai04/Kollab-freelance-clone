import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  hint,
  hintTone = "muted",
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  hintTone?: "muted" | "positive" | "negative";
  className?: string;
}) {
  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
          {icon && (
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {icon}
            </span>
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        {hint && (
          <p
            className={cn(
              "mt-1 text-xs",
              hintTone === "positive" && "text-emerald-600",
              hintTone === "negative" && "text-red-600",
              hintTone === "muted" && "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
