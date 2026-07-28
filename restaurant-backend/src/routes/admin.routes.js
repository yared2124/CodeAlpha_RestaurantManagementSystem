import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/dashboard", adminController.getDashboard);

// Additional admin endpoints can be added here:
// router.get('/users', adminController.getAllUsers);
// router.put('/users/:id/role', adminController.updateUserRole);

export default router;
