import express from 'express';
import { AddSkillController } from '../controllers/skill.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { EUserRole } from '../constant/enum';

const skillRouter = express.Router();

skillRouter.post(
    '/',
    authMiddleware,
    requireRole(EUserRole.CLIENT),
    AddSkillController
);

export default skillRouter;
