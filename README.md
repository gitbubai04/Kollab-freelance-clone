# FreeLancerApp

npm workspaces monorepo with two packages:

- [`server/`](server) — Express + Mongoose + Zod API
- [`freelance-web-app/`](freelance-web-app) — Vite + React frontend

## Getting started

```bash
npm install          # installs both workspaces
npm run dev           # generates docs/types, then runs backend + frontend together
```

Run them separately when you only need one:

```bash
npm run dev:server    # http://localhost:5000
npm run dev:client    # http://localhost:5173
```

## API docs

The backend builds its OpenAPI spec directly from the Zod schemas it already
uses to validate requests (via `zod-to-openapi`), so the docs can't drift
from the code.

- Swagger UI (browse + "Try it out"): `http://localhost:5000/api-docs`
- Raw spec: `http://localhost:5000/api-docs.json`

### Adding a new endpoint to the docs

1. Write/validate the request with a Zod schema as usual (`server/src/validators`).
2. Create `server/src/openapi/paths/<resource>.paths.ts` and call
   `registry.registerPath({ ... })`, reusing the Zod schema for the request
   body and `successResponse`/`errorResponse` from `openapi/common.ts` for
   responses (see `openapi/paths/auth.paths.ts` for a full example).
3. Import that file from `server/src/openapi/document.ts`.

The route shows up in Swagger UI and the generated spec immediately —
`app.ts` rebuilds the document from the registry on server start.

## Types shared with the frontend

`npm run generate` (or `npm run dev`, which runs it first) does two things:

1. `server`: writes the OpenAPI spec to `server/generated/openapi.json`.
2. `freelance-web-app`: runs `openapi-typescript` on that spec to produce
   `freelance-web-app/src/types/generated/api.ts` — full TypeScript types
   for every registered request/response.

Both `generated/` folders are build output (gitignored) — regenerate after
pulling backend changes that touch routes or validators:

```bash
npm run generate
```

Import from `@/types/api` (a stable hand-written re-export), not from
`@/types/generated/api` directly:

```ts
import type { ApiResponseBody, ApiRequestBody } from "@/types/api";

type SignInRequest = ApiRequestBody<"/api/v1/admin/auth/signin", "post">;
type SignInResponse = ApiResponseBody<"/api/v1/admin/auth/signin", "post", 200>;
```
