import {
  Bell,
  FolderKanban,
  LayoutGrid,
  Lock,
  Receipt,
  ScrollText,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardShell, type NavSection } from "@/layouts/dashboard-shell";

const navSections: NavSection[] = [
  {
    label: "Platform Governance",
    items: [
      { label: "Overview", to: "/admin/overview", icon: <LayoutGrid className="size-4" /> },
      { label: "Users", to: "/admin/users", icon: <Users className="size-4" /> },
      { label: "Projects", to: "/admin/projects", icon: <FolderKanban className="size-4" /> },
      { label: "Contracts", to: "/admin/contracts", icon: <ScrollText className="size-4" /> },
      { label: "Payments", to: "/admin/payments", icon: <Receipt className="size-4" /> },
      { label: "Wallets / Payouts", to: "/admin/wallets", icon: <Wallet className="size-4" /> },
      { label: "Notifications", to: "/admin/notifications", icon: <Bell className="size-4" /> },
      { label: "Settings", to: "/settings", icon: <Settings className="size-4" /> },
    ],
  },
];

export function AdminLayout() {
  return (
    <DashboardShell
      navSections={navSections}
      roleBadge="Super Admin"
      sidebarFooter={
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs">
          <p className="flex items-center gap-1.5 font-medium text-slate-900">
            <Lock className="size-3.5" /> Escrow Reserve
          </p>
          <p className="mt-1 text-muted-foreground">$482,500 Locked · FDIC Custody Vault</p>
        </div>
      }
    />
  );
}
