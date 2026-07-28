import { Router } from "express";
import authRoutes from "./auth.routes.js";
import menuRoutes from "./menu.routes.js";
import orderRoutes from "./order.routes.js";
import tableRoutes from "./table.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import reportingRoutes from "./reporting.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);
router.use("/tables", tableRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/reports", reportingRoutes);
router.use("/admin", adminRoutes);

export default router;
