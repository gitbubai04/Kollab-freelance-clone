// --- API request/response types -------------------------------------------
// Generated from the backend's OpenAPI spec (itself generated from the same
// Zod schemas the backend uses to validate requests) — every named schema
// registered in `server/src/openapi/paths/*.ts` shows up here, and in the
// Swagger "Schemas" section at http://localhost:5000/api-docs.
//
// Stale after a backend route/validator change? Run `npm run generate`
// (root) to refresh `./generated/api.ts`, then re-add/update the aliases
// below for whatever changed.
import type { components } from "./generated/api";

export type SignInRequest = components["schemas"]["SignInRequest"];
export type SignInResponse = components["schemas"]["SignInResponse"];
export type LogoutResponse = components["schemas"]["LogoutResponse"];
export type ApiErrorResponse = components["schemas"]["ErrorResponse"];

// --- Domain types (hand-written) -------------------------------------------

export type UserRole = "client" | "freelancer" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  title?: string;
  avatarUrl?: string;
  company?: string;
  timezone?: string;
  verified?: boolean;
}

export type ProjectStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type PaymentStructure = "fixed" | "hourly";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: "not_funded" | "funded" | "in_progress" | "submitted" | "released" | "completed";
  dueDate?: string;
  releasedDate?: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  paymentStructure: PaymentStructure;
  status: ProjectStatus;
  proposalsCount: number;
  deadline?: string;
  clientName: string;
  clientCompany: string;
  clientRating: number;
  skills: string[];
  milestones: Milestone[];
  postedAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  freelancerTitle: string;
  rating: number;
  reviewsCount: number;
  location: string;
  bidAmount: number;
  deliveryDays: number;
  coverLetter: string;
  skills: string[];
  status: "pending" | "shortlisted" | "interviewing" | "archived" | "hired";
  submittedAt: string;
}

export interface Contract {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  freelancerName: string;
  totalValue: number;
  paidToDate: number;
  inEscrow: number;
  paymentStructure: PaymentStructure;
  status: "active" | "completed" | "disputed";
  startedAt: string;
  targetCompletion: string;
  milestones: Milestone[];
}

export interface Transaction {
  id: string;
  projectTitle: string;
  counterpartyName: string;
  description: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderName: string;
  senderIsSelf: boolean;
  content: string;
  sentAt: string;
}

export interface MessageThread {
  id: string;
  participantName: string;
  participantAvatar?: string;
  projectTitle: string;
  lastMessagePreview: string;
  unreadCount: number;
  lastActivityAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: "escrow" | "proposal" | "system" | "message";
  read: boolean;
  createdAt: string;
  actionLabel?: string;
}
