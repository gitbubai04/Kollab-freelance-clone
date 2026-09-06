import {
  Bell,
  Compass,
  FileText,
  LayoutGrid,
  MessageSquare,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { DashboardShell, type NavSection } from "@/layouts/dashboard-shell";

const navSections: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/freelancer/overview", icon: <LayoutGrid className="size-4" /> },
      { label: "Find Projects", to: "/freelancer/find-projects", icon: <Compass className="size-4" /> },
      { label: "My Proposals", to: "/freelancer/proposals", icon: <FileText className="size-4" /> },
      { label: "Contracts", to: "/freelancer/contracts", icon: <FileText className="size-4" /> },
      { label: "Wallet", to: "/freelancer/wallet", icon: <Wallet className="size-4" /> },
      { label: "Messages", to: "/freelancer/messages", icon: <MessageSquare className="size-4" />, badge: 2 },
      { label: "Notifications", to: "/freelancer/notifications", icon: <Bell className="size-4" />, badge: 4 },
      { label: "Profile", to: "/settings", icon: <User className="size-4" /> },
    ],
  },
];

export function FreelancerLayout() {
  return (
    <DashboardShell
      navSections={navSections}
      roleBadge="Freelancer"
      sidebarFooter={
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          <ShieldCheck className="size-3.5" /> Escrow Guarantee Active
        </div>
      }
    />
  );
}
