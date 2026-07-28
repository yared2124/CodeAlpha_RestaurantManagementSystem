import { Router } from "express";
import * as menuController from "../controllers/menu.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

// Public GET routes
router.get("/categories", menuController.getAllCategories);
router.get("/items", menuController.getAllMenuItems);
router.get("/items/:id", menuController.getMenuItem);

// Admin-only write routes
const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

const menuItemSchema = Joi.object({
  categoryId: Joi.string().uuid().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  isAvailable: Joi.boolean().optional(),
  preparationTimeMinutes: Joi.number().integer().min(1).optional(),
  imageUrl: Joi.string().uri().optional(),
});

router.use(authenticate, requireAdmin);
router.post(
  "/categories",
  validate(categorySchema),
  menuController.createCategory,
);
router.post("/items", validate(menuItemSchema), menuController.createMenuItem);
router.put(
  "/items/:id",
  validate(menuItemSchema),
  menuController.updateMenuItem,
);
router.delete("/items/:id", menuController.deleteMenuItem);

export default router;
