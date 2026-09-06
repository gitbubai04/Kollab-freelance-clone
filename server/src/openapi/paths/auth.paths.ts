import { z } from "zod";
import { registry } from "../registry";
import { errorResponse, registerSuccessResponse } from "../common";
import { AdminLoginSchema } from "../../validators/admin.validator";

const TAG = "Auth";

// Named schemas: each shows up under its own name in the Swagger "Schemas"
// section, and as a named type (components["schemas"][Name]) in the
// frontend's generated types — see `@/types/index` for the re-exports.
const SignInRequest = registry.register("SignInRequest", AdminLoginSchema);

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/signin",
    tags: [TAG],
    summary: "Sign in with email and password",
    request: {
        body: {
            content: {
                "application/json": { schema: SignInRequest },
            },
        },
    },
    responses: {
        200: registerSuccessResponse(
            "SignInResponse",
            z.object({ role: z.string().openapi({ example: "admin" }) }),
            "Signed in successfully; sets an httpOnly auth cookie",
        ),
        400: errorResponse("Invalid credentials, or the account is inactive/deleted"),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/logout",
    tags: [TAG],
    summary: "Log out and clear the auth cookie",
    responses: {
        200: registerSuccessResponse("LogoutResponse", z.object({}), "Logged out successfully"),
        500: errorResponse("Unexpected server error"),
    },
});
