/**
 * admin.routes.js – admin dashboard (admin only).
 */
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', adminController.getDashboard);

export default router;
