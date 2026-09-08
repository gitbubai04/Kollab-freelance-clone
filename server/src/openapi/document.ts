import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";

// Each import below registers its routes on `registry` as a side effect.
// Add one `*.paths.ts` file per resource and import it here to include it
// in the generated docs, the Swagger UI, and the frontend's generated types.
import "./paths/auth.paths";
import "./paths/skill.paths";

export function buildOpenApiDocument() {
    const generator = new OpenApiGeneratorV31(registry.definitions);

    return generator.generateDocument({
        openapi: "3.1.0",
        info: {
            title: "FreeLancerApp API",
            version: "1.0.0",
            description:
                "Generated from the same Zod schemas used to validate requests, so the docs never drift from the code.",
        },
        servers: [{ url: "/" }],
    });
}
