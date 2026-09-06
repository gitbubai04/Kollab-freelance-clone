import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export function DashboardShell({
  navSections,
  roleBadge,
  sidebarFooter,
  headerActions,
}: {
  navSections: NavSection[];
  roleBadge?: string;
  sidebarFooter?: ReactNode;
  headerActions?: ReactNode;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-svh bg-[var(--brand-page-bg)]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <KollabLogo />
          {roleBadge && (
            <Badge variant="secondary" className="text-[11px]">
              {roleBadge}
            </Badge>
          )}
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      {item.label}
                    </span>
                    {!!item.badge && (
                      <Badge className="h-5 min-w-5 justify-center bg-blue-600 px-1 text-[11px]">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {sidebarFooter && <div className="border-t border-border p-4">{sidebarFooter}</div>}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <input
              placeholder="Search projects, contracts, talent..."
              className="w-full rounded-lg border border-border bg-slate-50 py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            <button className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-slate-100">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100">
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{initials(user?.fullName ?? "U")}</AvatarFallback>
                </Avatar>
                <span className="text-left text-sm">
                  <span className="block font-medium text-slate-900">{user?.fullName}</span>
                  <span className="block text-xs text-muted-foreground">{user?.title}</span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings")}>Profile &amp; Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/sign-in");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
