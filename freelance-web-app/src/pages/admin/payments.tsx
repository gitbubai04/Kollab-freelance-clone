import { Download } from "lucide-react";
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
import { adminPlatformStats } from "@/lib/admin-mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

export function AdminPaymentsPage() {
  const { data: transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments &amp; Treasury Ledger</h1>
          <p className="mt-1 text-sm text-muted-foreground">Direct Stripe Connect feed — dual escrow vault and multi-tenant routing.</p>
        </div>
        <Button variant="outline">
          <Download className="size-4" /> Export Statement
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Processed Volume" value={formatCurrency(adminPlatformStats.totalPaymentVolume)} hint="+24.1% YTD" hintTone="positive" />
        <StatCard label="Successful Settlements" value="98.84%" />
        <StatCard label="Failed / Retried" value="0.82%" hintTone="negative" />
        <StatCard label="Escrow Reserve in Custody" value={formatCurrency(adminPlatformStats.escrowReserve)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Client / Payer</TableHead>
              <TableHead>Freelancer / Payee</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Gross Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium text-blue-600">{txn.id}</TableCell>
                <TableCell>{txn.counterpartyName}</TableCell>
                <TableCell className="text-muted-foreground">—</TableCell>
                <TableCell>{txn.projectTitle}</TableCell>
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
