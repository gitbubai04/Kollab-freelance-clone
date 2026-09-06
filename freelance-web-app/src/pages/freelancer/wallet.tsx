import { Lock, ShieldCheck, TrendingUp, Wallet as WalletIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/use-payments";
import { formatCurrency, formatDate } from "@/lib/format";

export function FreelancerWalletPage() {
  const { data: transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Freelancer Treasury</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your available balance, pending escrow, and lifetime earnings.</p>
        </div>
        <Button>
          <WalletIcon className="size-4" /> Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Available Balance" value={formatCurrency(6800)} icon={<WalletIcon className="size-4" />} hint="Instant withdrawal ready" hintTone="positive" />
        <StatCard label="Pending Balance" value={formatCurrency(3500)} icon={<Lock className="size-4" />} hint="In escrow vault, auto-releases in 12 days" />
        <StatCard label="Total Earned" value={formatCurrency(48250)} icon={<TrendingUp className="size-4" />} hint="+18.4% vs last quarter" hintTone="positive" />
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-slate-900">Vault Guarantee Protected</p>
            <p className="text-xs text-muted-foreground">Milestone funds are deposited upfront by clients and held securely until deliverables are signed off.</p>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium text-blue-600">{txn.id}</TableCell>
                <TableCell>{txn.projectTitle}</TableCell>
                <TableCell className="text-muted-foreground">{txn.description}</TableCell>
                <TableCell className={`text-right font-medium ${txn.amount < 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {txn.amount > 0 ? "+" : ""}
                  {formatCurrency(txn.amount)}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(txn.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
