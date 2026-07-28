import { Router } from "express";
import * as reportingController from "../controllers/reporting.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/daily-sales", reportingController.getDailySales);
router.get("/stock-alerts", reportingController.getStockAlerts);
router.put("/stock-alerts/:id/resolve", reportingController.resolveStockAlert);
router.get("/popular-items", reportingController.getPopularItems);

export default router;
