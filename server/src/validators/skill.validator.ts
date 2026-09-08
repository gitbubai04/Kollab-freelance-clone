import { z } from "zod";

export const AddSkillSchema = z.object({
    name: z.string().trim().min(1, "Skill name is required").max(100, "Skill name must be under 100 characters"),
});
