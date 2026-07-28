import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

// All order routes require authentication
router.use(authenticate);

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

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "served",
      "completed",
      "cancelled",
    )
    .required(),
  reason: Joi.string().optional(),
});

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.put(
  "/:id/status",
  validate(updateStatusSchema),
  orderController.updateOrderStatus,
);

export default router;
