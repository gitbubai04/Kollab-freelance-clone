import { useRef, useState } from "react";
import { ArrowRight, Check, LayoutGrid, Mail, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyEmailCode } from "@/api/auth";
import { KollabLogo } from "@/components/brand/kollab-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [digits, setDigits] = useState<string[]>(["7", "2", "9", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");

  function handleChange(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleConfirm() {
    setVerifying(true);
    try {
      const result = await verifyEmailCode(code);
      if (result.verified) {
        setVerified(true);
        toast.success("Email verified successfully.");
      } else {
        toast.error("That code doesn't look right.");
      }
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <KollabLogo />

      <div className="mt-8 flex size-14 items-center justify-center rounded-2xl bg-blue-50">
        <Mail className="size-6 text-blue-600" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Verify your email</h1>
      <Badge variant="secondary" className="mt-2 bg-blue-50 text-blue-700">
        <span className="size-1.5 rounded-full bg-blue-500" /> {user?.email ?? "your@email.com"}
      </Badge>
      <p className="mt-3 text-sm text-muted-foreground">
        We&apos;ve sent a 6-digit confirmation code and verification link to your email address. Please click the
        link or enter the code to activate your account.
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            inputMode="numeric"
            className={cn(
              "size-12 rounded-lg border text-center text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500",
              digit ? "border-blue-300 bg-blue-50" : "border-border bg-slate-50",
            )}
          />
        ))}
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={handleConfirm} disabled={code.length < CODE_LENGTH || verifying}>
        {verifying ? "Confirming..." : "Confirm Code"}
        <ArrowRight className="size-4" />
      </Button>

      <button className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground" disabled>
        <RefreshCcw className="size-3.5" /> Resend Verification Email (available in 46s)
      </button>

      <p className="mt-4 text-sm text-muted-foreground">
        Wrong address? <span className="font-medium text-blue-600 hover:underline">Change Email</span> • Log out
      </p>

      {verified && (
        <div className="mt-8 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 p-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Check className="size-6" strokeWidth={3} />
          </div>
          <Badge variant="secondary" className="mt-3 bg-emerald-100 text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Active &amp; Validated
          </Badge>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Email verified successfully</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your account is now fully activated. All workspace collaborative features, escrow, and contracts are
            unlocked.
          </p>
          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={() => navigate("/complete-account")}
          >
            Go to Dashboard <LayoutGrid className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
