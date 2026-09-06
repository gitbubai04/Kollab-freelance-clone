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
import { useMyProposals } from "@/hooks/use-proposals";
import { formatCurrency, formatDate } from "@/lib/format";

export function MyProposalsPage() {
  const { data: proposals } = useMyProposals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Proposals</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track all submitted bids, shortlisted applications, and interview requests.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active Proposals" value={proposals?.filter((p) => p.status === "pending").length ?? "—"} />
        <StatCard label="Shortlisted / Interviewing" value={proposals?.filter((p) => p.status === "shortlisted" || p.status === "interviewing").length ?? "—"} />
        <StatCard label="Accepted" value={proposals?.filter((p) => p.status === "hired").length ?? 0} />
        <StatCard label="Archived" value={proposals?.filter((p) => p.status === "archived").length ?? 0} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Your Bid</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals?.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium text-slate-900">Project #{proposal.projectId.slice(-4)}</TableCell>
                <TableCell>{formatCurrency(proposal.bidAmount)}</TableCell>
                <TableCell>{proposal.deliveryDays} days</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(proposal.submittedAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={proposal.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
