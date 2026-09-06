import { ArrowLeft, Frown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  { label: "Active Freelancer Contracts", to: "/freelancer/contracts" },
  { label: "Verified Project Marketplace", to: "/freelancer/find-projects" },
  { label: "Treasury & Escrow Wallet", to: "/freelancer/wallet" },
];

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--brand-page-bg)] px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50">
        <Frown className="size-7 text-blue-600" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The project proposal, milestone deliverable, or URL endpoint you requested has been archived, relocated, or
        does not exist on this ledger node.
      </p>

      <div className="mt-6 w-full max-w-md space-y-2 rounded-xl border border-border bg-white p-4 text-left">
        <p className="px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Recommended destinations
        </p>
        {DESTINATIONS.map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            {d.label} <ArrowLeft className="size-3.5 rotate-180" />
          </Link>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="size-4" /> Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline">
          <Search className="size-4" /> Search Projects
        </Button>
      </div>
    </div>
  );
}
