import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from "@/hooks/use-contracts";
import { formatCurrency } from "@/lib/format";
import { FileText, Video, ShieldCheck } from "lucide-react";

const ACCEPTANCE_CRITERIA = [
  "Biometric prompt state machine (FaceID, TouchID, fallback timeout transitions)",
  "Fallback PIN entry flow (error shakes, keypad feedback, security lockout modals)",
  "Design token structure export (JSON/CSS typography, color and elevation tokens)",
  "Dark mode high-contrast audit (WCAG AAA verified on financial dashboard cards)",
];

export function ReviewMilestonePage() {
  const { contractId, milestoneId } = useParams<{ contractId: string; milestoneId: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading } = useContract(contractId);
  const [checked, setChecked] = useState<boolean[]>(ACCEPTANCE_CRITERIA.map(() => false));
  const [revisionNotes, setRevisionNotes] = useState("");

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!contract) return <p className="text-sm text-muted-foreground">Contract not found.</p>;

  const milestone = contract.milestones.find((m) => m.id === milestoneId) ?? contract.milestones[0];
  const allChecked = checked.every(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Contracts / {contract.id.toUpperCase()} / Review Submission</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Review Milestone Submission</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Carefully inspect the deliverables before authorizing the release of escrow funds.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{milestone.title}</CardTitle>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(milestone.amount)}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{milestone.description}</p>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Submitted Deliverables</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white p-3">
                <FileText className="size-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Design_Specs.fig</p>
                  <p className="text-xs text-muted-foreground">48.2 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white p-3">
                <Video className="size-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Prototype_Walkthrough.mp4</p>
                  <p className="text-xs text-muted-foreground">112 MB</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Milestone Acceptance Criteria</p>
            <div className="space-y-2">
              {ACCEPTANCE_CRITERIA.map((criterion, i) => (
                <label key={criterion} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                  <Checkbox
                    checked={checked[i]}
                    onCheckedChange={(c) =>
                      setChecked((prev) => prev.map((v, idx) => (idx === i ? c === true : v)))
                    }
                    className="mt-0.5"
                  />
                  {criterion}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Revision Notes (optional)</p>
            <Textarea
              rows={3}
              placeholder="Describe any changes needed before approval..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <ShieldCheck className="size-4" /> Kollab Escrow Protected — funds release only when you approve.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!revisionNotes}
                onClick={() => {
                  toast.info("Revision requested. The freelancer has been notified.");
                  navigate(`/client/contracts/${contract.id}`);
                }}
              >
                Request Revision
              </Button>
              <Button
                disabled={!allChecked}
                onClick={() => {
                  toast.success(`Released ${formatCurrency(milestone.amount)} to freelancer.`);
                  navigate(`/client/contracts/${contract.id}`);
                }}
              >
                Approve &amp; Release {formatCurrency(milestone.amount)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
