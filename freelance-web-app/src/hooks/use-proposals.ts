import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProposals, getProposalsByProject, submitProposal } from "@/api/proposals";
import type { SubmitProposalValues } from "@/lib/validation";

export function useProposalsByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["proposals", "project", projectId],
    queryFn: () => getProposalsByProject(projectId as string),
    enabled: !!projectId,
  });
}

export function useMyProposals() {
  return useQuery({ queryKey: ["proposals", "mine"], queryFn: getMyProposals });
}

export function useSubmitProposal(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: SubmitProposalValues) => submitProposal(projectId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
