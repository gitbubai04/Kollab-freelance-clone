import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { buildOpenApiDocument } from "./openapi/document";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// API docs — built from the same Zod schemas used to validate requests.
// Try requests directly from the browser at /api-docs, or fetch the raw
// spec from /api-docs.json (used by the frontend's `generate:types` script).
const openApiDocument = buildOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api-docs.json", (_req, res) => res.json(openApiDocument));

app.use(routes);

export default app;
