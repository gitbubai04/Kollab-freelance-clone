import { Router } from "express";
import { CompleteClientProfileController } from "../controllers/profile.controller";
import { authMiddleware, requireRole } from "../middleware/auth.middleware";
import { EUserRole } from "../constant/enum";

const ClientProfilePouter = Router();

ClientProfilePouter.post(
    "/complete",
    authMiddleware,
    requireRole(EUserRole.CLIENT),
    CompleteClientProfileController
);

export default ClientProfilePouter;