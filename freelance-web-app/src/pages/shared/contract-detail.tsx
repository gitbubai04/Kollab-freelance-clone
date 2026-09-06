import { Link, useParams } from "react-router-dom";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContract } from "@/hooks/use-contracts";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock, MessageSquare } from "lucide-react";

export function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const { data: contract, isLoading } = useContract(contractId);
  const role = useAuthStore((s) => s.user?.role);

  if (isLoading) return <Skeleton className="h-72 w-full" />;
  if (!contract) return <p className="text-sm text-muted-foreground">Contract not found.</p>;

  const remaining = contract.totalValue - contract.paidToDate - contract.inEscrow;
  const counterparty = role === "client" ? contract.freelancerName : contract.clientName;
  const reviewBasePath = role === "client" ? "/client" : "/freelancer";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Contracts / {contract.id.toUpperCase()}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{contract.projectTitle}</h1>
          <StatusBadge status={contract.status} className="mt-2" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="size-4" /> Message {role === "client" ? "Freelancer" : "Client"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Contract Value" value={formatCurrency(contract.totalValue)} />
        <StatCard label="Paid to Date" value={formatCurrency(contract.paidToDate)} hintTone="positive" hint={`${Math.round((contract.paidToDate / contract.totalValue) * 100)}% released`} />
        <StatCard label="In Escrow" value={formatCurrency(contract.inEscrow)} icon={<Lock className="size-4" />} />
        <StatCard label="Remaining Unfunded" value={formatCurrency(remaining)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Milestones Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contract.milestones.map((milestone, index) => (
              <div key={milestone.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Milestone {index + 1}</p>
                    <p className="text-sm font-medium text-slate-900">{milestone.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(milestone.amount)}</p>
                    <StatusBadge status={milestone.status} className="mt-1" />
                  </div>
                </div>
                {milestone.status === "submitted" && role === "client" && (
                  <Button asChild size="sm" className="mt-3">
                    <Link to={`${reviewBasePath}/contracts/${contract.id}/milestones/${milestone.id}/review`}>
                      Review Submission
                    </Link>
                  </Button>
                )}
                {milestone.status === "funded" && role === "freelancer" && (
                  <Button asChild size="sm" className="mt-3">
                    <Link to={`${reviewBasePath}/contracts/${contract.id}/milestones/${milestone.id}/submit`}>
                      Submit Work
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{role === "client" ? "Freelancer" : "Client"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{initials(counterparty)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900">{counterparty}</p>
                <p className="text-xs text-muted-foreground">Top Rated Plus</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract Started</span>
                <span className="font-medium text-slate-900">{formatDate(contract.startedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Completion</span>
                <span className="font-medium text-slate-900">{formatDate(contract.targetCompletion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Schedule</span>
                <span className="font-medium text-slate-900 capitalize">{contract.paymentStructure}</span>
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
              Funds are held safely in escrow and released only when milestone deliverables are approved.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
