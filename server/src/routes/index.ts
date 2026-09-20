import { Router } from "express";
import authRouter from "./auth.routes";
import skillRouter from "./skill.routes";
import ClientProfilePouter from "./profile.route";

const router = Router();

const ApiPrefix = "/api/v1";
const AdminPrefix = `${ApiPrefix}/admin`;
const ClientPrefix = `${ApiPrefix}/client`;

// ADMIN Routes
router.use(AdminPrefix + "/auth", authRouter);
router.use(AdminPrefix + "/skills", skillRouter);

// CLIENT Routes
router.use(ClientPrefix + '/profile', ClientProfilePouter);

// FREELANCER Routes

export default router;
