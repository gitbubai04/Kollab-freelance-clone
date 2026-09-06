import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminUsers } from "@/lib/admin-mock-data";
import { formatCurrency } from "@/lib/format";

const PAYOUT_QUEUE = adminUsers
  .filter((u) => u.role === "Freelancer" && u.status !== "Suspended")
  .map((u) => ({ ...u, requested: Math.round(u.totalVolume * 0.1) }));

export function AdminWalletsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Wallets &amp; Disbursement Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and authorize high-value withdrawals prior to banking dispatch.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Freelancer Balance" value={formatCurrency(842500)} />
        <StatCard label="Pending Payout Requests" value={formatCurrency(142850)} hintTone="negative" hint="38 requests awaiting sign-off" />
        <StatCard label="Completed (Last 30 Days)" value={formatCurrency(1240500)} hintTone="positive" hint="100% automated settlement" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Freelancer</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead className="text-right">Administrative Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYOUT_QUEUE.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </TableCell>
                <TableCell>{formatCurrency(row.requested)}</TableCell>
                <TableCell>{formatCurrency(row.totalVolume)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => toast.success(`Payout approved for ${row.name}.`)}>
                    Approve Payout
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
