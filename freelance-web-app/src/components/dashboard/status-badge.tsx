import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE_MAP: Record<string, string> = {
  // project / contract / milestone statuses
  draft: "bg-slate-100 text-slate-600",
  open: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
  active: "bg-blue-50 text-blue-700",
  disputed: "bg-red-50 text-red-700",
  funded: "bg-blue-50 text-blue-700",
  not_funded: "bg-slate-100 text-slate-500",
  submitted: "bg-amber-50 text-amber-700",
  released: "bg-emerald-50 text-emerald-700",
  // proposal statuses
  pending: "bg-amber-50 text-amber-700",
  shortlisted: "bg-emerald-50 text-emerald-700",
  interviewing: "bg-blue-50 text-blue-700",
  archived: "bg-slate-100 text-slate-500",
  hired: "bg-emerald-50 text-emerald-700",
};

const LABEL_MAP: Record<string, string> = {
  in_progress: "In Progress",
  not_funded: "Not Funded",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = TONE_MAP[status] ?? "bg-slate-100 text-slate-600";
  const label = LABEL_MAP[status] ?? status.replace(/_/g, " ");
  return (
    <Badge variant="secondary" className={cn("gap-1.5 capitalize", tone, className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </Badge>
  );
}
