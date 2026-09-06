import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/api/payments";

export function useTransactions() {
  return useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
}
