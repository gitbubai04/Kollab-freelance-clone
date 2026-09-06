import fs from "fs";
import path from "path";
import { buildOpenApiDocument } from "./document";

const outDir = path.join(__dirname, "..", "..", "generated");
const outFile = path.join(outDir, "openapi.json");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(buildOpenApiDocument(), null, 2));

console.log(`OpenAPI spec written to ${outFile}`);
