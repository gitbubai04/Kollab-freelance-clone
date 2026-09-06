import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Adds the `.openapi()` helper to every zod schema. Must run before any
// schema in the app calls `.openapi()`, which is why every file in this
// folder imports `registry` first.
extendZodWithOpenApi(z);

// Single shared registry: every `routes/*.paths.ts` file registers its
// endpoints here, and `document.ts` turns it into the final OpenAPI spec.
export const registry = new OpenAPIRegistry();
