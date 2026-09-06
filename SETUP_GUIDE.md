# Monorepo + Auto-Docs + Shared-Types Setup Guide

A reusable runbook for what was set up in this project: one repo running a
frontend and backend that can start together or separately, API docs that
are generated (and testable) from the same validation code, and TypeScript
types that flow from backend → frontend automatically. Keep this file
alongside the project it documents, or copy it as a starting checklist for
the next one.

---

## 1. The ask, and the shape it took

| Requirement | Tool chosen | Why this one |
|---|---|---|
| One repo, run front+back together or separately | **npm workspaces** + **concurrently** | Already using npm in both folders; no new package manager (pnpm/yarn) or build orchestrator (Turborepo/Nx) needed for two packages. |
| API docs, listed and testable in a browser | **swagger-ui-express** | Serves an interactive "Try it out" UI from a plain OpenAPI JSON document — no separate doc server. |
| Docs generated automatically, not hand-written | **@asteasolutions/zod-to-openapi** | The backend already validates requests with **Zod**. This library turns those *same* Zod schemas into an OpenAPI document, so docs can't drift from validation code — one schema, two outputs. |
| Backend types available to the frontend automatically | **openapi-typescript** | Reads the generated OpenAPI JSON and emits `.ts` type definitions. Combined with the above, the flow is: Zod schema → OpenAPI spec → TypeScript types, fully generated, no hand duplication. |

If a future project's backend does **not** already use Zod for validation,
swap step 3 below for `swagger-jsdoc` (docs from `@openapi` JSDoc comments
on route handlers) — the rest of the pipeline (swagger-ui-express,
openapi-typescript) stays the same.

---

## 2. Step by step

### Step 1 — Turn the repo into an npm workspace

Root `package.json` (create if it doesn't already exist):

```json
{
  "name": "<repo-name>",
  "private": true,
  "workspaces": ["server", "frontend"],
  "scripts": {
    "dev": "npm run generate --silent && concurrently -n SERVER,CLIENT -c blue,green \"npm:dev:server\" \"npm:dev:client\"",
    "dev:server": "npm run dev -w server",
    "dev:client": "npm run dev -w frontend",
    "build": "npm run build -w server && npm run build -w frontend",
    "generate": "npm run generate:openapi -w server && npm run generate:types -w frontend",
    "generate:openapi": "npm run generate:openapi -w server",
    "generate:types": "npm run generate:types -w frontend"
  },
  "devDependencies": {
    "concurrently": "^10.0.5"
  }
}
```

`workspaces` just needs to list the existing package folders — they don't
need to move. Each still keeps its own `package.json`.

### Step 2 — Do a clean install from the root

If the sub-folders already had their own `node_modules`/`package-lock.json`
from before they became workspaces, **delete those first**:

```bash
rm -rf node_modules server/node_modules frontend/node_modules
rm -f server/package-lock.json frontend/package-lock.json
npm install
```

Leftover per-package installs cause npm to hoist packages inconsistently
(see Gotcha #3 below) — always start a workspace conversion from a clean
slate.

### Step 3 — Backend: install the OpenAPI/Swagger stack

```bash
npm install @asteasolutions/zod-to-openapi swagger-ui-express -w server
npm install -D @types/swagger-ui-express -w server
```

Create `server/src/openapi/registry.ts`:

```ts
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z); // must run before ANY zod schema is built — see Gotcha #4

export const registry = new OpenAPIRegistry();
```

Create `server/src/openapi/common.ts` — shared response-envelope helpers so
every route doesn't repeat the same success/error wrapper shape:

```ts
import { z, ZodTypeAny } from "zod";
import { registry } from "./registry";

export const ErrorResponseSchema = registry.register(
  "ErrorResponse",
  z.object({
    success: z.literal(false).openapi({ example: false }),
    message: z.string().openapi({ example: "Something went wrong" }),
  }),
);

// Registering under a name gives it its own entry in Swagger's "Schemas"
// section and its own named TypeScript type on the frontend, instead of an
// anonymous inline object.
export const registerSuccessResponse = (name: string, dataSchema: ZodTypeAny, description: string) => {
  const schema = registry.register(
    name,
    z.object({
      success: z.literal(true).openapi({ example: true }),
      message: z.string().openapi({ example: "Success" }),
      data: dataSchema,
    }),
  );
  return { description, content: { "application/json": { schema } } };
};

export const errorResponse = (description: string) => ({
  description,
  content: { "application/json": { schema: ErrorResponseSchema } },
});
```

Create one `server/src/openapi/paths/<resource>.paths.ts` per resource —
this is where an existing Zod validator schema gets turned into a
documented route:

```ts
import { registry } from "../registry";
import { errorResponse, registerSuccessResponse } from "../common";
import { SomeRequestSchema } from "../../validators/some.validator";

const SomeRequest = registry.register("SomeRequest", SomeRequestSchema);

registry.registerPath({
  method: "post",
  path: "/api/v1/some-resource",
  tags: ["SomeResource"],
  summary: "Describe what this does",
  request: { body: { content: { "application/json": { schema: SomeRequest } } } },
  responses: {
    200: registerSuccessResponse("SomeResponse", /* z.object({...}) */ SomeRequestSchema, "Description"),
    400: errorResponse("Invalid input"),
  },
});
```

Create `server/src/openapi/document.ts` — the single place that assembles
every registered path into one OpenAPI document:

```ts
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";

// Each import below registers its routes as a side effect. Add one line
// per resource file.
import "./paths/auth.paths";
// import "./paths/<resource>.paths";

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: { title: "<API name>", version: "1.0.0", description: "Generated from Zod validation schemas." },
    servers: [{ url: "/" }],
  });
}
```

Create `server/src/openapi/generate-spec.ts` — writes the spec to disk so
the frontend can read it (see Step 4):

```ts
import fs from "fs";
import path from "path";
import { buildOpenApiDocument } from "./document";

const outFile = path.join(__dirname, "..", "..", "generated", "openapi.json");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(buildOpenApiDocument(), null, 2));
console.log(`OpenAPI spec written to ${outFile}`);
```

Add to `server/package.json` scripts: `"generate:openapi": "ts-node ./src/openapi/generate-spec.ts"`.

Wire Swagger UI into the running server, in `server/src/app.ts`:

```ts
import swaggerUi from "swagger-ui-express";
import { buildOpenApiDocument } from "./openapi/document";

const openApiDocument = buildOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api-docs.json", (_req, res) => res.json(openApiDocument));
```

**Critical ordering rule** — in the entrypoint (`server/src/index.ts`),
import the registry module *first*, before anything else:

```ts
import './openapi/registry'; // must be the very first import — see Gotcha #4
import mongoose from 'mongoose';
import app from './app';
// ...
```

### Step 4 — Frontend: generate types from the spec

```bash
npm install -D openapi-typescript -w frontend
```

Add to `frontend/package.json` scripts:

```json
"generate:types": "openapi-typescript ../server/generated/openapi.json -o ./src/types/generated/api.ts"
```

Gitignore both generated folders (`server/generated`, `frontend/src/types/generated`)
— they're build output, regenerated by `npm run generate`.

In the frontend's types file (e.g. `src/types/index.ts`), re-export named
types from the generated file, one alias per registered schema name:

```ts
import type { components } from "./generated/api";

export type SomeRequest = components["schemas"]["SomeRequest"];
export type SomeResponse = components["schemas"]["SomeResponse"];
```

### Step 5 — Run it

```bash
npm install        # once, from root
npm run dev         # generates docs+types, then runs both dev servers
npm run dev:server  # backend only
npm run dev:client  # frontend only
```

Check `http://localhost:<backend-port>/api-docs` — every registered path
should be listed and callable with "Try it out", and named schemas should
appear under the "Schemas" section at the bottom.

---

## 3. Gotchas hit while doing this (and the fix)

1. **`openapi-typescript` install failed with an ERESOLVE peer conflict**
   because it pins `typescript: ^5.x` as a peer, but the frontend was on
   TypeScript 6. *Fix*: root `.npmrc` with `legacy-peer-deps=true` — the
   peer range just hadn't caught up yet; the library works fine on TS 6 in
   practice.

2. **Two different Zod versions across workspaces** (backend `^4.3.6`,
   frontend `^4.5.4`) silently broke `zod-to-openapi`'s type augmentation,
   because npm couldn't hoist one shared copy — each workspace got its own
   nested `zod`. *Fix*: align both workspaces to the exact same Zod
   version range so npm hoists a single shared copy to the root
   `node_modules`.

3. **Hoisted packages (`openapi-typescript`, `swagger-ui-express`) couldn't
   find their own peer dependencies** (`typescript`, `express`) at runtime,
   even after aligning versions — because those peers were only installed
   *nested* inside one workspace, not reachable from the root
   `node_modules` where the tool got hoisted to. Root cause: leftover
   `node_modules`/lockfiles from before the workspace conversion, which
   prevented a clean re-hoist. *Fix*: delete all `node_modules` and
   per-package lockfiles and reinstall from the root once (Step 2); if it
   still happens, add the missing peer as a root-level `devDependency`
   purely so the hoisted tool can resolve it (doesn't affect the
   workspace's own build, which resolves its nested copy first).

4. **`extendZodWithOpenApi` didn't retroactively patch existing schemas.**
   In Zod v4, a schema bakes in its methods (like `.openapi()`) at
   *construction* time — patching the shared prototype after the fact
   does not add the method to instances built earlier. If any validator
   file is imported (and its Zod schema built) before the OpenAPI registry
   module runs, calling `.openapi()`/`registry.register()` on it later
   throws `TypeError: ... .openapi is not a function`. *Fix*: import the
   registry module as the **very first line** of the app's entrypoint,
   before any other import — guarantees the patch is in place before any
   route/controller/validator anywhere in the app can construct a schema.

5. **Stale/orphaned dev server processes serving old code.** Killing a
   `nodemon`/`ts-node` process tree from a terminal (especially on
   Windows) doesn't always kill every child — an old process can keep
   holding the port and silently keep serving pre-edit code, producing
   confusing "the route doesn't exist" errors even though the source file
   is correct. *Fix*: if a running server doesn't reflect a code change,
   check what's actually bound to the port (`Get-NetTCPConnection
   -LocalPort <port>` in PowerShell, or `netstat -ano | grep <port>`) and
   kill that PID specifically, then restart.

---

## 4. Adding a new endpoint (the recurring workflow)

1. `server/src/validators/<name>.validator.ts` — Zod schema for the request.
2. `server/src/models/<name>.model.ts` (+ `interface/<name>.interface.ts`) — if new data.
3. `server/src/controllers/<name>.controller.ts` — handler using the validator + `handleSuccess`/`handleError`.
4. `server/src/routes/<name>.routes.ts` — Express router.
5. `server/src/app.ts` — mount the router.
6. `server/src/openapi/paths/<name>.paths.ts` — `registry.registerPath({...})`, reusing the Zod schema, naming request/response schemas via `registerSuccessResponse`/`registry.register`.
7. `server/src/openapi/document.ts` — add the `import "./paths/<name>.paths";` line.
8. From repo root: `npm run generate` — regenerates the OpenAPI JSON and the frontend's TypeScript types.
9. `frontend/src/types/index.ts` — add named type aliases for the new schemas.
10. Check `/api-docs` to confirm the route and its schemas show up.
