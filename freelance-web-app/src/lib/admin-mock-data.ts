export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: "Client" | "Freelancer";
  status: "Active" | "Flagged" | "Suspended";
  totalVolume: number;
  joinedDate: string;
}

export const adminUsers: AdminUserRow[] = [
  { id: "usr-1", name: "Elena Rostova", email: "elena.rostova@techcorp.io", role: "Client", status: "Active", totalVolume: 68420, joinedDate: "2024-09-01" },
  { id: "usr-2", name: "Alex Vance", email: "alex.vance@studio-kollab.io", role: "Freelancer", status: "Active", totalVolume: 48250, joinedDate: "2024-08-14" },
  { id: "usr-3", name: "Liam Henderson", email: "liam.h@henderson-dev.co", role: "Freelancer", status: "Active", totalVolume: 140200, joinedDate: "2024-05-10" },
  { id: "usr-4", name: "Dmitri Volkov", email: "dmitri@cryptovault.ch", role: "Client", status: "Flagged", totalVolume: 12000, joinedDate: "2024-10-02" },
  { id: "usr-5", name: "Sarah Jenkins", email: "sarah.j@jenkins-tech.net", role: "Freelancer", status: "Suspended", totalVolume: 22400, joinedDate: "2024-06-22" },
  { id: "usr-6", name: "Priya Sharma", email: "priya.sharma@arch-ui.io", role: "Freelancer", status: "Active", totalVolume: 210000, joinedDate: "2024-02-18" },
];

export interface AdminDispute {
  id: string;
  projectTitle: string;
  clientName: string;
  amount: number;
  severity: "High" | "Medium" | "Low";
  reason: string;
}

export const adminDisputes: AdminDispute[] = [
  {
    id: "prj-5120",
    projectTitle: "Decentralized Lending Protocol UI",
    clientName: "CryptoLedger Inc",
    amount: 12000,
    severity: "High",
    reason: "Client filed non-performance claim against assigned contractor. Escrow is frozen pending supervisory sign-off.",
  },
];

export const adminPlatformStats = {
  totalUsers: 24850,
  activeProjects: 1420,
  activeContracts: 958,
  totalPaymentVolume: 18600000,
  pendingPayouts: 142850,
  escrowReserve: 482500,
};
