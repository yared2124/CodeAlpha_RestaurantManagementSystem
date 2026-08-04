import { Router } from "express";
import * as tableController from "../controllers/table.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import Joi from "joi";

const router = Router();

router.use(authenticate);

// Availability check
router.get("/availability/check", tableController.checkTableAvailability);

// Reservation routes
const reservationSchema = Joi.object({
  tableId: Joi.string().uuid().required(),
  customerName: Joi.string().required(),
  customerPhone: Joi.string().optional(),
  customerEmail: Joi.string().email().optional(),
  reservationTime: Joi.date().iso().required(),
  durationMinutes: Joi.number().integer().min(15).default(90),
  partySize: Joi.number().integer().min(1).required(),
});

router.post(
  "/reservations",
  validate(reservationSchema),
  tableController.createReservation,
);
router.get("/reservations", tableController.getReservations);

// Table routes
router.get("/", tableController.getAllTables);
router.get("/:id", tableController.getTable);
router.put(
  "/:id/status",
  validate(
    Joi.object({
      status: Joi.string()
        .valid("available", "occupied", "reserved", "out-of-service")
        .required(),
    }),
  ),
  tableController.updateTableStatus,
);

router.post(
  "/",
  validate(
    Joi.object({
      tableNumber: Joi.number().integer().min(1).required(),
      capacity: Joi.number().integer().min(1).required(),
      location: Joi.string().optional(),
    }),
  ),
  tableController.createTable,
);

export default router;
