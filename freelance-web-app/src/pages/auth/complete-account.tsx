import { useFormik } from "formik";
import { ArrowRight, Building2, Check, Clock, LayoutDashboard, LogOut, ShieldCheck, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initials } from "@/lib/format";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { completeAccountSchema, type CompleteAccountValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const TIMEZONES = [
  "UTC-08:00 Pacific Time (US & Canada)",
  "UTC-05:00 Eastern Time (US & Canada)",
  "UTC+00:00 London",
  "UTC+01:00 Zurich, Berlin",
  "UTC+05:30 Mumbai, New Delhi",
];

export function CompleteAccountPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();

  const formik = useFormik<CompleteAccountValues>({
    initialValues: {
      role: user?.role === "freelancer" ? "freelancer" : "client",
      company: user?.company ?? "",
      timezone: user?.timezone ?? "",
    },
    validate: zodToFormikValidate(completeAccountSchema),
    onSubmit: (values, { setSubmitting }) => {
      updateUser({ role: values.role, company: values.company, timezone: values.timezone });
      toast.success("Workspace ready — welcome to Kollab!");
      navigate(values.role === "client" ? "/client/overview" : "/freelancer/overview");
      setSubmitting(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <KollabLogo />
        <Badge variant="secondary" className="gap-1.5 bg-emerald-50 text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Secure Auth
        </Badge>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-blue-50/60 p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{initials(user?.fullName ?? "U")}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="flex items-center gap-1 text-sm font-medium text-slate-900">
              {user?.fullName ?? "Guest User"}
              <ShieldCheck className="size-3.5 text-blue-600" />
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
          Switch
        </Button>
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">Complete your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Just a few details to tailor your workspace experience.</p>

      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-5 text-left">
        <div className="space-y-2">
          <Label>Select your role</Label>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              icon={<Users2 className="size-4" />}
              title="Client"
              description="Hire talent & post projects"
              selected={formik.values.role === "client"}
              onClick={() => formik.setFieldValue("role", "client")}
            />
            <RoleCard
              icon={<LayoutDashboard className="size-4" />}
              title="Freelancer"
              description="Deliver work & earn"
              selected={formik.values.role === "freelancer"}
              onClick={() => formik.setFieldValue("role", "freelancer")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="company">Company or Organization</Label>
            <span className="text-xs text-muted-foreground">Required</span>
          </div>
          <div className="relative">
            <Building2 className="absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              id="company"
              name="company"
              placeholder="TechCorp Systems Inc."
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-slate-50 pl-9"
            />
          </div>
          {formik.touched.company && formik.errors.company && (
            <p className="text-xs text-destructive">{formik.errors.company}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formik.values.timezone} onValueChange={(v) => formik.setFieldValue("timezone", v)}>
            <SelectTrigger className="w-full bg-slate-50">
              <Clock className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.timezone && formik.errors.timezone && (
            <p className="text-xs text-destructive">{formik.errors.timezone}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={formik.isSubmitting}>
          Continue to Dashboard
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <button onClick={logout} className="flex items-center gap-1 hover:text-slate-900">
          <LogOut className="size-3.5" /> Cancel &amp; switch account
        </button>
        <span className="font-medium hover:text-slate-900">Terms &amp; Privacy</span>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-3 text-left transition-colors",
        selected ? "border-blue-300 bg-blue-50" : "border-border bg-white hover:bg-slate-50",
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">{icon}</div>
      <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        {title}
        {selected && (
          <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}
