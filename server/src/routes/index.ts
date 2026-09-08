import { Router } from "express";
import authRouter from "./auth.routes";
import skillRouter from "./skill.routes";

const router = Router();

const ApiPrefix = "/api/v1";
const AdminPrefix = `${ApiPrefix}/admin`;

// ADMIN Routes
router.use(AdminPrefix + "/auth", authRouter);
router.use(AdminPrefix + "/skills", skillRouter);

export default router;
