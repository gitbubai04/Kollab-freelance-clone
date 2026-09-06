import { simulateRequest } from "@/api/mock-utils";
import { mockTransactions } from "@/lib/mock-data";
import type { Transaction } from "@/types";

export async function getTransactions(): Promise<Transaction[]> {
  return simulateRequest(mockTransactions);
}
