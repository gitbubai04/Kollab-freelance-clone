import { useState } from "react";
import { useFormik } from "formik";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signIn } from "@/api/auth";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { signInSchema, type SignInValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";

export function SignInPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<SignInValues>({
    initialValues: { email: "", password: "" },
    validate: zodToFormikValidate(signInSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { user, token } = await signIn(values);
        login(user, token);
        toast.success("Welcome back!");
        navigate(user.role === "client" ? "/client/overview" : "/freelancer/overview");
      } catch {
        toast.error("Unable to sign in. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center text-center">
      <KollabLogo />
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your credentials to access your workspaces and active contracts
      </p>

      <form onSubmit={formik.handleSubmit} className="mt-8 w-full space-y-5 text-left">
        <div className="space-y-1.5">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@work.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-slate-50"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-destructive">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-slate-50 pr-10"
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
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-destructive">{formik.errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Signing in..." : "Sign in with Email"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-6 flex w-full items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium tracking-wide text-muted-foreground">OR CONTINUE WITH</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="secondary" className="w-full bg-slate-50 hover:bg-slate-100" size="lg" type="button">
        <GoogleIcon />
        Google Workspace
      </Button>

      <p className="mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/sign-up" className="font-medium text-blue-600 hover:underline">
          Create account
        </Link>
      </p>

      <div className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        Protected by enterprise grade encryption
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.96 6.96 0 0 1 5.45 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
