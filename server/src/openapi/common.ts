import { z, ZodTypeAny } from "zod";
import { registry } from "./registry";

export const ErrorResponseSchema = registry.register(
    "ErrorResponse",
    z.object({
        success: z.literal(false).openapi({ example: false }),
        message: z.string().openapi({ example: "Something went wrong" }),
    }),
);

// Registers the response envelope under `name` so it gets its own named
// entry in the Swagger "Schemas" section (and its own named type in the
// frontend's generated types) instead of being inlined anonymously.
export const registerSuccessResponse = (name: string, dataSchema: ZodTypeAny, description: string) => {
    const schema = registry.register(
        name,
        z.object({
            success: z.literal(true).openapi({ example: true }),
            message: z.string().openapi({ example: "Success" }),
            data: dataSchema,
        }),
    );

    return {
        description,
        content: {
            "application/json": { schema },
        },
    };
};

export const errorResponse = (description: string) => ({
    description,
    content: {
        "application/json": {
            schema: ErrorResponseSchema,
        },
    },
});
