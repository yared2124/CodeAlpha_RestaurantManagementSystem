import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

// Validation schemas
const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        unitPrice: Joi.number().positive().required(),
      }),
    )
    .min(1)
    .required(),
  tableId: Joi.string().uuid().optional(),
  orderType: Joi.string().valid("dine-in", "takeaway", "delivery").required(),
});

// Apply authentication to all order routes
router.use(authenticate);

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.put("/:id/status", orderController.updateOrderStatus);

export default router;
