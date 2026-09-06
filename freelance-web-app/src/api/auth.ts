import { simulateRequest } from "@/api/mock-utils";
import { mockUsers } from "@/lib/mock-data";
import type { SignInValues, SignUpValues } from "@/lib/validation";
import type { User } from "@/types";

export async function signIn(values: SignInValues): Promise<{ user: User; token: string }> {
  const isClientDomain = values.email.toLowerCase().includes("client") || values.email.toLowerCase().includes("techcorp");
  const user = isClientDomain ? mockUsers.client : mockUsers.freelancer;
  return simulateRequest({ user: { ...user, email: values.email }, token: "mock-jwt-token" });
}

export async function signUp(values: SignUpValues): Promise<{ user: User; token: string }> {
  const base = values.joinAs === "client" ? mockUsers.client : mockUsers.freelancer;
  const user: User = { ...base, fullName: values.fullName, email: values.email, role: values.joinAs, verified: false };
  return simulateRequest({ user, token: "mock-jwt-token" });
}

export async function requestPasswordReset(_email: string): Promise<{ sent: boolean }> {
  return simulateRequest({ sent: true }, 800);
}

export async function verifyEmailCode(code: string): Promise<{ verified: boolean }> {
  return simulateRequest({ verified: code.length === 6 }, 800);
}
