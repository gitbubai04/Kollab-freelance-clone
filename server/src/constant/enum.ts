export const ROLE = ["CLIENT", "FREELANCER", "ADMIN"] as const;
export type IUserRole = (typeof ROLE)[number];

export enum EUserRole {
    CLIENT = "CLIENT",
    FREELANCER = "FREELANCER",
    ADMIN = "ADMIN",
};
