import express from 'express';
import { AddSkillController } from '../controllers/skill.controller';
import { authAdminMiddleware } from '../middleware/auth.middleware';

const skillRouter = express.Router();

skillRouter.post('/', authAdminMiddleware, AddSkillController);

export default skillRouter;
