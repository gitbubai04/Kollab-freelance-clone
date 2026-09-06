import { simulateRequest } from "@/api/mock-utils";
import { mockContracts } from "@/lib/mock-data";
import type { Contract } from "@/types";

export async function getContracts(): Promise<Contract[]> {
  return simulateRequest(mockContracts);
}

export async function getContractById(id: string): Promise<Contract | undefined> {
  return simulateRequest(mockContracts.find((c) => c.id === id));
}
