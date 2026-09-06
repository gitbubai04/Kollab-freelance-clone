import { AlertTriangle, FolderKanban, ScrollText, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminDisputes, adminPlatformStats } from "@/lib/admin-mock-data";
import { formatCurrency } from "@/lib/format";

export function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">Executive Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">System Telemetry &amp; Liquidity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time platform health, growth, and treasury reconciliation.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={adminPlatformStats.totalUsers.toLocaleString()} icon={<Users className="size-4" />} hint="+12.4%" hintTone="positive" />
        <StatCard label="Active Projects" value={adminPlatformStats.activeProjects.toLocaleString()} icon={<FolderKanban className="size-4" />} />
        <StatCard label="Active Contracts" value={adminPlatformStats.activeContracts.toLocaleString()} icon={<ScrollText className="size-4" />} hint="Escrowed" />
        <StatCard label="Total Payment Volume" value={formatCurrency(adminPlatformStats.totalPaymentVolume)} icon={<Wallet className="size-4" />} hint="+24.1%" hintTone="positive" />
        <StatCard
          label="Pending Payouts"
          value={formatCurrency(adminPlatformStats.pendingPayouts)}
          icon={<AlertTriangle className="size-4" />}
          hint="38 in queue"
          hintTone="negative"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="size-4" /> Active Arbitration Case
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {adminDisputes.map((dispute) => (
            <div key={dispute.id} className="rounded-lg border border-red-100 bg-red-50/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{dispute.projectTitle}</p>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Severity: {dispute.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {dispute.clientName} · {formatCurrency(dispute.amount)} frozen
              </p>
              <p className="mt-2 text-sm text-slate-700">{dispute.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
