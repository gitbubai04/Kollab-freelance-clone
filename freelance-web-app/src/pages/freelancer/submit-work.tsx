import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from "@/hooks/use-contracts";
import { formatCurrency } from "@/lib/format";

export function SubmitWorkPage() {
  const { contractId, milestoneId } = useParams<{ contractId: string; milestoneId: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading } = useContract(contractId);
  const [summary, setSummary] = useState("");

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!contract) return <p className="text-sm text-muted-foreground">Contract not found.</p>;

  const milestone = contract.milestones.find((m) => m.id === milestoneId) ?? contract.milestones[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Contracts / {contract.id.toUpperCase()} / Submit Work</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Submit Work for {milestone.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escrow value protected: {formatCurrency(milestone.amount)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Summary &amp; Deliverables Explanation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={6}
            placeholder="Outline key achievements, architectural revisions, and QA validation instructions..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
            <Upload className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-slate-900">Drag &amp; drop deliverable files here</p>
            <p className="text-xs text-muted-foreground">or browse filesystem — ZIP, PDF, MP4, code bundles (max 250MB)</p>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
            Once submitted, the client has up to 14 days to review or the escrow auto-releases to your wallet.
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button
              disabled={!summary}
              onClick={() => {
                toast.success(`Work submitted for review. ${formatCurrency(milestone.amount)} pending release.`);
                navigate(`/freelancer/contracts/${contract.id}`);
              }}
            >
              Submit Work &amp; Request Release
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
