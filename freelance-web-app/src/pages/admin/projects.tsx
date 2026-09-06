import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjects } from "@/hooks/use-projects";
import { adminDisputes } from "@/lib/admin-mock-data";
import { formatCurrency } from "@/lib/format";

export function AdminProjectsPage() {
  const { data: projects } = useProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Project Moderation &amp; Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Escrow-backed project catalog and dispute oversight.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Cataloged" value={projects?.length ?? "—"} hint="+18 this week" hintTone="positive" />
        <StatCard label="Escrow Backed" value={projects?.filter((p) => p.status === "in_progress" || p.status === "open").length ?? "—"} />
        <StatCard label="Under Dispute" value={adminDisputes.length} hintTone="negative" />
        <StatCard
          label="Average Project Value"
          value={formatCurrency(
            projects && projects.length ? Math.round(projects.reduce((sum, p) => sum + p.budget, 0) / projects.length) : 0,
          )}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Proposals</TableHead>
              <TableHead>Governance Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => {
              const disputed = adminDisputes.some((d) => d.id === project.id);
              return (
                <TableRow key={project.id} className={disputed ? "bg-red-50/40" : undefined}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.code}</p>
                  </TableCell>
                  <TableCell>{project.clientCompany}</TableCell>
                  <TableCell>{formatCurrency(project.budget)}</TableCell>
                  <TableCell>{project.proposalsCount} received</TableCell>
                  <TableCell>
                    <StatusBadge status={disputed ? "disputed" : project.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
