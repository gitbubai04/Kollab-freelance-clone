export const ROLE = ["CLIENT", "FREELANCER", "ADMIN"] as const;
export type Role = (typeof ROLE)[number];
