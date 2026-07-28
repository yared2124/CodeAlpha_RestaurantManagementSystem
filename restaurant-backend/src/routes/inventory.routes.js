import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

router.use(authenticate, requireAdmin);

// Ingredient CRUD
router.get("/", inventoryController.getAllIngredients);
router.put(
  "/:id",
  validate(
    Joi.object({
      stockQuantity: Joi.number().min(0).optional(),
      minThreshold: Joi.number().min(0).optional(),
      reorderQuantity: Joi.number().min(0).optional(),
    }),
  ),
  inventoryController.updateIngredient,
);

// Stock validation (useful for admins to simulate)
router.post(
  "/validate",
  validate(
    Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            menuItemId: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).required(),
          }),
        )
        .min(1)
        .required(),
    }),
  ),
  inventoryController.validateStock,
);

// Transaction log (optional)
router.get("/transactions", inventoryController.getTransactions);

export default router;
