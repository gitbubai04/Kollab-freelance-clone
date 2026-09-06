import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function KollabLogo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex size-6 items-center justify-center rounded-md bg-slate-900 text-white">
        <Check className="size-4" strokeWidth={3} />
      </span>
      {!iconOnly && (
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Kollab<span className="text-blue-600">.</span>
        </span>
      )}
    </div>
  );
}
