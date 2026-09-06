import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContracts } from "@/hooks/use-contracts";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export function ContractsListPage() {
  const { data: contracts } = useContracts();
  const role = useAuthStore((s) => s.user?.role);
  const basePath = role === "client" ? "/client" : "/freelancer";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Contracts</h1>
        <p className="mt-1 text-sm text-muted-foreground">All active and completed escrow-backed contracts.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>{role === "client" ? "Freelancer" : "Client"}</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>In Escrow</TableHead>
              <TableHead>Target Completion</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium text-slate-900">{contract.projectTitle}</TableCell>
                <TableCell>{role === "client" ? contract.freelancerName : contract.clientName}</TableCell>
                <TableCell>{formatCurrency(contract.totalValue)}</TableCell>
                <TableCell>{formatCurrency(contract.inEscrow)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(contract.targetCompletion)}</TableCell>
                <TableCell>
                  <StatusBadge status={contract.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`${basePath}/contracts/${contract.id}`}>View</Link>
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
