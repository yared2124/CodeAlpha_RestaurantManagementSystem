import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

router.use(authenticate, requireAdmin);

// ---------- Ingredient CRUD ----------
// GET all ingredients
router.get("/", inventoryController.getAllIngredients);

// CREATE new ingredient
router.post(
  "/",
  validate(
    Joi.object({
      name: Joi.string().required(),
      unit: Joi.string().required(),
      stockQuantity: Joi.number().min(0).default(0),
      minThreshold: Joi.number().min(0).default(5),
      reorderQuantity: Joi.number().min(0).optional(),
    }),
  ),
  inventoryController.createIngredient,
);

// UPDATE ingredient (stock, threshold, etc.)
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

// ---------- Recipe endpoints ----------
// CREATE a recipe (link menu item to ingredient)
router.post(
  "/recipes",
  validate(
    Joi.object({
      menuItemId: Joi.string().uuid().required(),
      ingredientId: Joi.string().uuid().required(),
      quantityRequired: Joi.number().positive().required(),
      unit: Joi.string().optional(),
    }),
  ),
  inventoryController.createRecipe,
);

// ---------- Stock validation (simulate order check) ----------
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

// ---------- Transaction log (optional) ----------
router.get("/transactions", inventoryController.getTransactions);

export default router;
