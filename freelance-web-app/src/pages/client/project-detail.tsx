import { Link, useParams } from "react-router-dom";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/use-projects";
import { useProposalsByProject } from "@/hooks/use-proposals";
import { formatCurrency, formatDate } from "@/lib/format";

export function ClientProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useProject(projectId);
  const { data: proposals } = useProposalsByProject(projectId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!project) return <p className="text-sm text-muted-foreground">Project not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Projects / {project.code}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={project.status} />
            <span className="text-xs text-muted-foreground">Posted {formatDate(project.postedAt)}</span>
          </div>
        </div>
        <Button asChild>
          <Link to={`/client/projects/${project.id}/proposals`}>View All Proposals</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Proposals" value={project.proposalsCount} />
        <StatCard label="Budget" value={formatCurrency(project.budget)} hint={project.paymentStructure === "fixed" ? "Fixed" : "Hourly"} />
        <StatCard label="Deadline" value={project.deadline ? formatDate(project.deadline) : "—"} />
        <StatCard label="Client Rating" value={`★ ${project.clientRating}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Scope &amp; Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals?.length ? (
              proposals.slice(0, 3).map((proposal) => (
                <div key={proposal.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{proposal.freelancerName}</p>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(proposal.bidAmount)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{proposal.freelancerTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">★ {proposal.rating} ({proposal.reviewsCount} reviews) · {proposal.location}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No proposals yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {project.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Milestones Blueprint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {String(index + 1).padStart(2, "0")}. {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(milestone.amount)}</p>
                  <StatusBadge status={milestone.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
