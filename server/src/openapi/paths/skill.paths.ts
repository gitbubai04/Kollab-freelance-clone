import { z } from "zod";
import { registry } from "../registry";
import { errorResponse, registerSuccessResponse } from "../common";
import { AddSkillSchema } from "../../validators/skill.validator";

const TAG = "Skills";

const AddSkillRequest = registry.register("AddSkillRequest", AddSkillSchema);

const SkillSchema = registry.register(
    "Skill",
    z.object({
        _id: z.string().openapi({ example: "6512f1c2a1b2c3d4e5f6a7b8" }),
        name: z.string().openapi({ example: "React" }),
        createdAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    }),
);

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/skills",
    tags: [TAG],
    summary: "Add a new skill (admin only)",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": { schema: AddSkillRequest },
            },
        },
    },
    responses: {
        201: registerSuccessResponse("AddSkillResponse", SkillSchema, "Skill added successfully"),
        400: errorResponse("Validation error"),
        401: errorResponse("Not authorised"),
        409: errorResponse("Skill already exists"),
    },
});
