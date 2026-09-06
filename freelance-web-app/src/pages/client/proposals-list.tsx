import { useState } from "react";
import { useParams } from "react-router-dom";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/use-projects";
import { useProposalsByProject } from "@/hooks/use-proposals";
import { formatCurrency } from "@/lib/format";
import type { Proposal } from "@/types";
import { toast } from "sonner";

export function ClientProposalsListPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { data: proposals, isLoading } = useProposalsByProject(projectId);
  const [hireTarget, setHireTarget] = useState<Proposal | null>(null);
  const [escrowAgreed, setEscrowAgreed] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Projects / {project?.title}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Proposals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {proposals?.length ?? 0} total proposals · Budget {project ? formatCurrency(project.budget) : "—"}
        </p>
      </div>

      <div className="space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        {proposals?.map((proposal) => (
          <Card key={proposal.id}>
            <CardContent className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{proposal.freelancerName}</p>
                  <StatusBadge status={proposal.status} />
                </div>
                <p className="text-sm text-muted-foreground">{proposal.freelancerTitle}</p>
                <p className="text-xs text-muted-foreground">
                  ★ {proposal.rating} ({proposal.reviewsCount} reviews) · {proposal.location}
                </p>
                <p className="text-sm text-slate-700">{proposal.coverLetter}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {proposal.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-48 shrink-0 text-right">
                <p className="text-xs text-muted-foreground uppercase">Proposed Bid</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(proposal.bidAmount)}</p>
                <p className="text-xs text-muted-foreground">{proposal.deliveryDays} calendar days</p>
                <Button className="mt-3 w-full" onClick={() => setHireTarget(proposal)}>
                  Hire Freelancer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!hireTarget} onOpenChange={(open) => !open && setHireTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire {hireTarget?.freelancerName}</DialogTitle>
            <DialogDescription>{project?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Type</span>
              <span className="font-medium text-slate-900">Fixed-Price Milestone Contract</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Agreed Amount</span>
              <span className="font-medium text-slate-900">{hireTarget ? formatCurrency(hireTarget.bidAmount) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Initial Escrow Deposit Required</span>
              <span className="font-semibold text-blue-700">{hireTarget ? formatCurrency(hireTarget.bidAmount * 0.3) : "—"}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="escrow-agree" checked={escrowAgreed} onCheckedChange={(c) => setEscrowAgreed(c === true)} className="mt-0.5" />
            <Label htmlFor="escrow-agree" className="text-sm font-normal text-muted-foreground">
              I authorize Kollab to hold the initial milestone amount in escrow and agree to the Kollab Escrow
              Protection and Service Terms.
            </Label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHireTarget(null)}>
              Cancel
            </Button>
            <Button
              disabled={!escrowAgreed}
              onClick={() => {
                toast.success(`Contract created with ${hireTarget?.freelancerName}. Escrow funded.`);
                setHireTarget(null);
                setEscrowAgreed(false);
              }}
            >
              Create Contract &amp; Fund Escrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
