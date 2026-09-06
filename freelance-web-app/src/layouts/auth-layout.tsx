import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[var(--brand-page-bg)] px-4 py-12">
      <div className="w-full max-w-[480px] rounded-2xl border border-border bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
        <Outlet />
      </div>
    </div>
  );
}
