import {
  Bell,
  FileCheck2,
  FileText,
  LayoutGrid,
  MessageSquare,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardShell, type NavSection } from "@/layouts/dashboard-shell";

const navSections: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/client/overview", icon: <LayoutGrid className="size-4" /> },
      { label: "Projects", to: "/client/projects", icon: <Sparkles className="size-4" /> },
      { label: "Proposals", to: "/client/proposals", icon: <FileText className="size-4" /> },
      { label: "Contracts", to: "/client/contracts", icon: <FileCheck2 className="size-4" /> },
      { label: "Payments", to: "/client/payments", icon: <Receipt className="size-4" /> },
      { label: "Messages", to: "/client/messages", icon: <MessageSquare className="size-4" />, badge: 3 },
      { label: "Notifications", to: "/client/notifications", icon: <Bell className="size-4" />, badge: 5 },
      { label: "Settings", to: "/settings", icon: <Settings className="size-4" /> },
    ],
  },
];

export function ClientLayout() {
  return (
    <DashboardShell
      navSections={navSections}
      roleBadge="Client"
      headerActions={
        <Button asChild size="sm">
          <Link to="/client/projects/new">+ Post Project</Link>
        </Button>
      }
      sidebarFooter={
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <ShieldCheck className="size-3.5" /> Client Escrow Protected
        </div>
      }
    />
  );
}
