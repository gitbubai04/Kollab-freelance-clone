import { simulateRequest } from "@/api/mock-utils";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification } from "@/types";

export async function getNotifications(): Promise<Notification[]> {
  return simulateRequest(mockNotifications);
}
