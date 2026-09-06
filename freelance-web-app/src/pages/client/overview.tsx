import { ArrowUpRight, Briefcase, FileCheck2, FileText, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { useContracts } from "@/hooks/use-contracts";
import { useMyProposals } from "@/hooks/use-proposals";
import { useProjects } from "@/hooks/use-projects";
import { useAuthStore } from "@/store/auth-store";

export function ClientOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: proposals, isLoading: loadingProposals } = useMyProposals();
  const { data: contracts } = useContracts();

  const totalSpent = contracts?.reduce((sum, c) => sum + c.paidToDate, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">Workspace Overview</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Welcome back, {user?.fullName?.split(" ")[0] ?? "there"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here is what&apos;s happening across your active workspace today.</p>
        </div>
        <Button asChild>
          <Link to="/client/projects/new">+ Post New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={projects?.filter((p) => p.status !== "draft").length ?? "—"} icon={<Briefcase className="size-4" />} hint="+2 this month" hintTone="positive" />
        <StatCard label="Proposals Received" value={proposals?.length ?? "—"} icon={<FileText className="size-4" />} hint="12 awaiting review" />
        <StatCard label="Active Contracts" value={contracts?.length ?? "—"} icon={<FileCheck2 className="size-4" />} hint={`${formatCurrency(contracts?.reduce((s, c) => s + c.inEscrow, 0) ?? 0)} committed`} />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<Wallet className="size-4" />} hint="+14% vs last quarter" hintTone="positive" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link to="/client/projects" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {loadingProjects && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            {projects?.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to={`/client/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.code} · {formatCurrency(project.budget)} {project.paymentStructure === "fixed" ? "Fixed" : "Hourly"}</p>
                </div>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Contracts &amp; Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contracts?.map((contract) => {
              const activeMilestone = contract.milestones.find((m) => m.status === "submitted" || m.status === "in_progress");
              return (
                <div key={contract.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-slate-900">{contract.freelancerName}</p>
                  <p className="text-xs text-muted-foreground">{contract.projectTitle}</p>
                  {activeMilestone && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{activeMilestone.title}</span>
                        <span className="font-medium text-slate-900">{formatCurrency(activeMilestone.amount)}</span>
                      </div>
                      <Progress value={65} className="mt-2 h-1.5" />
                    </div>
                  )}
                  <Button asChild size="sm" variant="secondary" className="mt-3 w-full">
                    <Link to={`/client/contracts/${contract.id}`}>Review Contract</Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Proposals</CardTitle>
          <Link to="/client/proposals" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-1">
          {loadingProposals && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          {proposals?.slice(0, 3).map((proposal) => (
            <div key={proposal.id} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-900">{proposal.freelancerName}</p>
                <p className="text-xs text-muted-foreground">{proposal.freelancerTitle} · {formatCurrency(proposal.bidAmount)} · {proposal.deliveryDays} days delivery</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={proposal.status} />
                <Button asChild size="sm">
                  <Link to={`/client/projects/${proposal.projectId}/proposals`}>Review</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
