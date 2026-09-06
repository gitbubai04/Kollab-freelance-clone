import { useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminUsers, type AdminUserRow } from "@/lib/admin-mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<AdminUserRow["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Flagged: "bg-amber-50 text-amber-700",
  Suspended: "bg-red-50 text-red-700",
};

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [suspendTarget, setSuspendTarget] = useState<AdminUserRow | null>(null);

  const filtered = adminUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Accounts &amp; Identity Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">{adminUsers.length.toLocaleString()} records under KYC/AML statutory validation.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Clients Active" value={adminUsers.filter((u) => u.role === "Client").length} />
        <StatCard label="Freelancers" value={adminUsers.filter((u) => u.role === "Freelancer").length} />
        <StatCard label="Flagged / Escalations" value={adminUsers.filter((u) => u.status === "Flagged").length} hintTone="negative" />
        <StatCard label="Suspended" value={adminUsers.filter((u) => u.status === "Suspended").length} hintTone="negative" />
      </div>

      <Input placeholder="Search users by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm bg-white" />

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Identity</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Volume</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(STATUS_TONE[user.status])}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(user.totalVolume)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.joinedDate)}</TableCell>
                <TableCell className="text-right">
                  {user.status === "Suspended" ? (
                    <Button size="sm" variant="outline" onClick={() => toast.success(`${user.name} reactivated.`)}>
                      Activate
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => setSuspendTarget(user)}>
                      Suspend
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Administrative Suspension</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {suspendTarget?.name}? All active escrow releases will be immediately
              frozen and pending proposals locked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success(`${suspendTarget?.name} suspended.`);
                setSuspendTarget(null);
              }}
            >
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
