import { simulateRequest } from "@/api/mock-utils";
import { mockProposals } from "@/lib/mock-data";
import type { SubmitProposalValues } from "@/lib/validation";
import type { Proposal } from "@/types";

export async function getProposalsByProject(projectId: string): Promise<Proposal[]> {
  return simulateRequest(mockProposals.filter((p) => p.projectId === projectId));
}

export async function getMyProposals(): Promise<Proposal[]> {
  return simulateRequest(mockProposals);
}

export async function submitProposal(projectId: string, values: SubmitProposalValues): Promise<Proposal> {
  const proposal: Proposal = {
    id: `prop-${Math.floor(Math.random() * 9000 + 1000)}`,
    projectId,
    freelancerName: "Alex Vance",
    freelancerTitle: "Sr. Systems Designer",
    rating: 4.9,
    reviewsCount: 12,
    location: "San Francisco, CA",
    bidAmount: values.bidAmount,
    deliveryDays: values.deliveryDays,
    coverLetter: values.coverLetter,
    skills: [],
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  return simulateRequest(proposal, 700);
}
