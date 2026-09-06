import { Download, Lock, Wallet } from "lucide-react";
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
import { useTransactions } from "@/hooks/use-payments";
import { formatCurrency, formatDate } from "@/lib/format";

export function ClientPaymentsPage() {
  const { data: transactions } = useTransactions();

  const totalSpent = transactions?.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments &amp; Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track escrow deposits, milestone releases, and billing methods.</p>
        </div>
        <Button variant="outline">
          <Download className="size-4" /> Export Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<Wallet className="size-4" />} hint="+14% vs last quarter" hintTone="positive" />
        <StatCard label="Held in Escrow" value={formatCurrency(9500)} icon={<Lock className="size-4" />} hint="3 active contracts pending sign-off" />
        <StatCard label="Completed Payments" value={transactions?.length ?? "—"} hint="0 disputes open" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium text-blue-600">{txn.id}</TableCell>
                <TableCell>{txn.projectTitle}</TableCell>
                <TableCell>{txn.counterpartyName}</TableCell>
                <TableCell className="text-muted-foreground">{txn.description}</TableCell>
                <TableCell className="text-muted-foreground">{txn.method}</TableCell>
                <TableCell className={`text-right font-medium ${txn.amount < 0 ? "text-red-600" : "text-slate-900"}`}>
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
