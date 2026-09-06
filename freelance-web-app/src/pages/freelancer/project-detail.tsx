import { Link, useParams } from "react-router-dom";
import { Bookmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/use-projects";
import { formatCurrency, formatDate } from "@/lib/format";

export function FreelancerProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!project) return <p className="text-sm text-muted-foreground">Project not found.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <p className="text-xs text-muted-foreground">Find Projects / {project.code}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{project.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Posted {formatDate(project.postedAt)} by {project.clientCompany} · {project.category}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Overview &amp; Objectives</CardTitle>
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

        {project.milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Proposed Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-slate-900">
                    {index + 1}. {milestone.title}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(milestone.amount)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="h-fit">
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Fixed Price Budget</p>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(project.budget)}</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Target</span>
              <span className="font-medium text-slate-900">{project.deadline ? formatDate(project.deadline) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Candidates</span>
              <span className="font-medium text-slate-900">{project.proposalsCount} proposals</span>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link to={`/freelancer/find-projects/${project.id}/apply`}>Submit a Proposal</Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Bookmark className="size-4" /> Save Project
          </Button>

          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
            <p className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="size-3.5" /> Kollab Vault Escrow Protection
            </p>
            <p className="mt-1">
              All funds are pre-authorized into Kollab Vault Escrow. Milestone payments release immediately upon
              client approval.
            </p>
          </div>

          <div className="border-t border-border pt-4 text-sm">
            <p className="font-medium text-slate-900">{project.clientCompany}</p>
            <p className="text-xs text-muted-foreground">★ {project.clientRating} · Verified client</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
