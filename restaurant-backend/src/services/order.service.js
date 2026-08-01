/**
 * OrderService – handles order creation, status updates, and inventory deduction.
 * Now with synchronous (non‑event) inventory management.
 */
import { Order, OrderItem } from "../models/index.js";
import { sequelize } from "../models/index.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import inventoryService from "./inventory.service.js";
import tableService from "./table.service.js";
import logger from "../utils/logger.js";

class OrderService {
  /**
   * Create a new order.
   * Steps:
   * 1. Validate table availability (if dine‑in)
   * 2. Validate inventory (synchronous)
   * 3. Create order, items, and deduct stock in a single transaction
   * 4. Return order ID
   */
  async createOrder(data) {
    const { items, tableId, customerId, orderType } = data;

    // 1. Table availability (if dine-in)
    if (tableId && orderType === "dine-in") {
      const available = await tableService.isTableAvailable(
        tableId,
        new Date(),
      );
      if (!available) {
        throw new ValidationError(
          "Table is not available for the requested time",
        );
      }
    }

    // 2. Inventory validation (fail fast)
    const stockCheck = await inventoryService.validateStock(items);
    if (!stockCheck.available) {
      throw new ValidationError(
        `Insufficient stock: ${stockCheck.missingItems.join(", ")}`,
      );
    }

    // 3. Transaction – create order, items, and deduct stock
    const t = await sequelize.transaction();
    try {
      const totalAmount = items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      );
      const order = await Order.create(
        {
          customerId,
          tableId: tableId || null,
          orderType,
          totalAmount,
          status: "pending",
        },
        { transaction: t },
      );

      // Create order items
      await OrderItem.bulkCreate(
        items.map((i) => ({
          orderId: order.id,
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        { transaction: t },
      );

      // 4. Deduct inventory synchronously (inside the transaction)
      //    If stock fails, the transaction will rollback automatically.
      const stockResult = await inventoryService.deductStock(items, order.id);
      if (!stockResult.success) {
        throw new Error(`Inventory deduction failed: ${stockResult.reason}`);
      }

      await t.commit();

      // (Optional) If you still want to publish events for logging/audit,
      // you can call publishEvent here – but it's not needed for inventory.
      // publishEvent('order.events', 'order.placed', { orderId: order.id, ... });

      return { orderId: order.id, status: order.status };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Update order status.
   * If status becomes 'cancelled', restore inventory.
   */
  async updateStatus(orderId, status, reason = null) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new NotFoundError("Order");

    // Basic state machine
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["served", "cancelled"],
      served: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    if (!validTransitions[order.status]?.includes(status)) {
      throw new ValidationError(
        `Invalid status transition from ${order.status} to ${status}`,
      );
    }

    await order.update({ status });

    // If cancelled, restore inventory
    if (status === "cancelled") {
      const items = await this.getOrderItems(orderId);
      const restoreResult = await inventoryService.restoreStock(
        items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        orderId,
      );
      if (!restoreResult.success) {
        logger.error("Failed to restore stock for cancelled order", {
          orderId,
          error: restoreResult.reason,
        });
        // Still allow cancellation, but log the error
      }
    }

    // (Optional) emit events for logging
    // if (status === 'completed') publishEvent(...)

    return order;
  }

  async getOrderById(id) {
    const order = await Order.findByPk(id, { include: ["items"] });
    if (!order) throw new NotFoundError("Order");
    return order;
  }

  async getOrderItems(orderId) {
    return OrderItem.findAll({ where: { orderId } });
  }

  async getAllOrders(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customerId) where.customerId = filters.customerId;
    return Order.findAll({
      where,
      include: ["items"],
      order: [["createdAt", "DESC"]],
    });
  }
}

export default new OrderService();
