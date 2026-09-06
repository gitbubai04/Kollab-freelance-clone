import { useState } from "react";
import { useFormik } from "formik";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { requestPasswordReset } from "@/api/auth";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodToFormikValidate } from "@/lib/formik-zod";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "set">("request");

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: { email: "" },
    validate: zodToFormikValidate(forgotPasswordSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await requestPasswordReset(values.email);
        toast.success("Reset link sent — check your inbox.");
        setStep("set");
      } catch {
        toast.error("Couldn't send the reset link. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center text-center">
      <KollabLogo />
      <Badge variant="secondary" className="mt-4 bg-blue-50 text-blue-700">
        <span className="size-1.5 rounded-full bg-blue-500" /> Authentication Services
      </Badge>

      <Tabs value={step} className="mt-6 w-full" onValueChange={(v) => setStep(v as typeof step)}>
        <TabsList className="w-full">
          <TabsTrigger value="request">1. Request Link</TabsTrigger>
          <TabsTrigger value="set" disabled={step === "request"}>
            2. Set Password
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {step === "request" ? (
        <>
          <div className="mt-6 flex w-full items-center gap-3 text-left">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <KeyRound className="size-4" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Reset your password</h1>
            </div>
          </div>
          <p className="mt-2 text-left text-sm text-muted-foreground">
            Enter your registered email address and we&apos;ll send you a secure verification reset link.
          </p>

          <form onSubmit={formik.handleSubmit} className="mt-6 w-full space-y-1.5 text-left">
            <Label htmlFor="email">Work Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alex.vance@studio-kollab.io"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-slate-50"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-destructive">{formik.errors.email}</p>
            )}
            <Button type="submit" className="mt-4 w-full" size="lg" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 flex w-full items-center justify-between text-sm">
            <Link to="/sign-in" className="flex items-center gap-1 text-muted-foreground hover:text-slate-900">
              <ArrowLeft className="size-3.5" /> Back to login
            </Link>
            <button onClick={() => setStep("set")} className="font-medium text-blue-600 hover:underline">
              Have a reset token?
            </button>
          </div>
        </>
      ) : (
        <SetNewPassword />
      )}

      <div className="mt-6 flex w-full items-center justify-between rounded-lg bg-blue-50/60 px-4 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-blue-500" /> TLS 1.3 256-bit Encrypted
        </span>
        <span>Sec ID: #KLB-9402</span>
      </div>
    </div>
  );
}

function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <form
      className="mt-6 w-full space-y-4 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Password updated. You can now sign in.");
      }}
    >
      <h1 className="text-xl font-semibold text-slate-900">Set a new password</h1>
      <div className="space-y-1.5">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-50"
          placeholder="••••••••••••"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="bg-slate-50"
          placeholder="••••••••••••"
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        Update Password
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
