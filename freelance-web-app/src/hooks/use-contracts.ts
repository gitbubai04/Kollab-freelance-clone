import { useQuery } from "@tanstack/react-query";
import { getContractById, getContracts } from "@/api/contracts";

export function useContracts() {
  return useQuery({ queryKey: ["contracts"], queryFn: getContracts });
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ["contracts", id],
    queryFn: () => getContractById(id as string),
    enabled: !!id,
  });
}
