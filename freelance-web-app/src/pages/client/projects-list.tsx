import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { useProjects } from "@/hooks/use-projects";
import type { ProjectStatus } from "@/types";

export function ClientProjectsListPage() {
  const { data: projects } = useProjects();
  const [search, setSearch] = useState("");

  const filtered = projects?.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) ?? [];
  const countByStatus = (status: ProjectStatus) => projects?.filter((p) => p.status === status).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your projects and track proposals, contracts, and milestones.</p>
        </div>
        <Button asChild>
          <Link to="/client/projects/new">+ Create Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total" value={projects?.length ?? "—"} />
        <StatCard label="Draft" value={countByStatus("draft")} />
        <StatCard label="Open" value={countByStatus("open")} />
        <StatCard label="In Progress" value={countByStatus("in_progress")} />
        <StatCard label="Completed" value={countByStatus("completed")} />
      </div>

      <Input
        placeholder="Search projects by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-white"
      />

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Proposals</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FolderOpen className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.code}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{project.paymentStructure}</TableCell>
                <TableCell>{formatCurrency(project.budget)}</TableCell>
                <TableCell>{project.proposalsCount} received</TableCell>
                <TableCell>{project.deadline ? formatDate(project.deadline) : "—"}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/client/projects/${project.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
