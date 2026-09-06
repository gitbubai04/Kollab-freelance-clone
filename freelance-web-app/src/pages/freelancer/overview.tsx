import { Briefcase, Clock, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useContracts } from "@/hooks/use-contracts";
import { useProjects } from "@/hooks/use-projects";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export function FreelancerOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: projects } = useProjects();
  const { data: contracts } = useContracts();

  const suggested = projects?.filter((p) => p.status === "open").slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">Executive Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, {user?.fullName?.split(" ")[0] ?? "there"}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Contracts" value={contracts?.length ?? "—"} icon={<Briefcase className="size-4" />} hint="+1 this week" hintTone="positive" />
        <StatCard label="Pending Proposals" value={6} icon={<Clock className="size-4" />} hint="2 shortlisted for interview" />
        <StatCard label="Total Earnings (YTD)" value={formatCurrency(48250)} icon={<TrendingUp className="size-4" />} hint="+18.4% vs prev quarter" hintTone="positive" />
        <StatCard label="Available Balance" value={formatCurrency(6800)} icon={<Wallet className="size-4" />} hint="Instant payout ready" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Curated Opportunities</CardTitle>
            <Link to="/freelancer/find-projects" className="text-sm font-medium text-blue-600 hover:underline">
              Explore all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggested.map((project) => (
              <div key={project.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.clientCompany} · {formatCurrency(project.budget)} {project.paymentStructure}</p>
                </div>
                <Button asChild size="sm">
                  <Link to={`/freelancer/find-projects/${project.id}`}>View Project</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Contracts &amp; Milestone Velocity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contracts?.map((contract) => {
              const activeMilestone = contract.milestones.find((m) => m.status === "submitted" || m.status === "funded");
              return (
                <div key={contract.id}>
                  <p className="text-sm font-medium text-slate-900">{contract.projectTitle}</p>
                  <p className="text-xs text-muted-foreground">Client: {contract.clientName}</p>
                  {activeMilestone && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs">
                        <span>{activeMilestone.title}</span>
                        <span className="font-medium">{formatCurrency(activeMilestone.amount)}</span>
                      </div>
                      <Progress value={60} className="mt-1.5 h-1.5" />
                    </div>
                  )}
                  <Button asChild size="sm" variant="secondary" className="mt-2 w-full">
                    <Link to={`/freelancer/contracts/${contract.id}`}>View Contract</Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
