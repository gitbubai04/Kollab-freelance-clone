import { useState } from "react";
import { useFormik } from "formik";
import { ArrowRight, Briefcase, Check, CodeXml, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUp } from "@/api/auth";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { signUpSchema, type SignUpValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";

export function SignUpPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik<SignUpValues>({
    initialValues: {
      joinAs: "client",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validate: zodToFormikValidate(signUpSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { user, token } = await signUp(values);
        login(user, token);
        toast.success("Account created — let's finish setting up your workspace.");
        navigate("/complete-account");
      } catch {
        toast.error("Something went wrong creating your account.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordChecks = {
    length: formik.values.password.length >= 8,
    uppercase: /[A-Z]/.test(formik.values.password),
    numOrSymbol: /[0-9!@#$%^&*]/.test(formik.values.password),
  };

  return (
    <div className="flex flex-col items-center text-center">
      <KollabLogo />
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">Create your Kollab account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join thousands of vetted clients and high-performing independent specialists
      </p>

      <form onSubmit={formik.handleSubmit} className="mt-8 w-full space-y-5 text-left">
        <div className="space-y-2">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            <RoleOption
              icon={<Briefcase className="size-4" />}
              title="I'm a Client"
              description="Hiring top talent, tracking contracts, and managing project milestones"
              selected={formik.values.joinAs === "client"}
              onClick={() => formik.setFieldValue("joinAs", "client")}
            />
            <RoleOption
              icon={<CodeXml className="size-4" />}
              title="I'm a Specialist"
              description="Finding high-impact projects, getting paid securely, and delivering work"
              selected={formik.values.joinAs === "freelancer"}
              onClick={() => formik.setFieldValue("joinAs", "freelancer")}
            />
          </div>
        </div>

        <FieldWithIcon
          id="fullName"
          label="Full Name"
          icon={<User className="size-4" />}
          placeholder="Alex Vance"
          formik={formik}
        />
        <FieldWithIcon
          id="email"
          label="Work Email"
          icon={<Mail className="size-4" />}
          placeholder="alex.vance@company.com"
          formik={formik}
        />

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-slate-50 pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <PasswordRule met={passwordChecks.length} label="8+ chars" />
            <PasswordRule met={passwordChecks.uppercase} label="1 uppercase" />
            <PasswordRule met={passwordChecks.numOrSymbol} label="1 num/symbol" />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-destructive">{formik.errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <ShieldCheck className="absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-slate-50 pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-xs text-destructive">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeToTerms"
            checked={formik.values.agreeToTerms}
            onCheckedChange={(checked) => formik.setFieldValue("agreeToTerms", checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="agreeToTerms" className="text-sm font-normal text-muted-foreground">
            I agree to the{" "}
            <span className="font-medium text-blue-600 hover:underline">Terms of Service</span>,{" "}
            <span className="font-medium text-blue-600 hover:underline">Privacy Policy</span>, and Escrow
            Protections.
          </Label>
        </div>
        {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
          <p className="-mt-3 text-xs text-destructive">{formik.errors.agreeToTerms}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Creating account..." : "Create Account"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-6 flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-wide text-muted-foreground">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full" size="lg" type="button">
        Sign up with Google
      </Button>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/sign-in" className="font-medium text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function RoleOption({
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
      <div className="flex items-center justify-between text-sm font-medium text-slate-900">
        <span className="flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {selected && (
          <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <span className={cn("flex items-center gap-1 text-xs", met ? "text-emerald-600" : "text-muted-foreground")}>
      <span className={cn("flex size-3 items-center justify-center rounded-full border", met ? "border-emerald-600 bg-emerald-600" : "border-muted-foreground")}>
        {met && <Check className="size-2 text-white" strokeWidth={4} />}
      </span>
      {label}
    </span>
  );
}

function FieldWithIcon({
  id,
  label,
  icon,
  placeholder,
  formik,
}: {
  id: "fullName" | "email";
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  formik: ReturnType<typeof useFormik<SignUpValues>>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 my-auto text-muted-foreground">{icon}</span>
        <Input
          id={id}
          name={id}
          placeholder={placeholder}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-slate-50 pl-9"
        />
      </div>
      {formik.touched[id] && formik.errors[id] && (
        <p className="text-xs text-destructive">{formik.errors[id]}</p>
      )}
    </div>
  );
}
