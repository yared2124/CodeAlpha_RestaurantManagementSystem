import { Order, OrderItem } from "../models/index.js";
import { sequelize } from "../models/index.js";
import { publishEvent } from "../utils/messaging.js";
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
   * 3. Create order and items in a transaction
   * 4. Publish OrderPlaced event (asynchronous)
   * 5. Return order ID
   */
  async createOrder(data) {
    const { items, tableId, customerId, orderType } = data;

    // 1. Table availability check (if dine-in)
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

    // 3. Transaction
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

      await t.commit();

      // 4. Publish event asynchronously (outbox pattern would be better,
      //    but we'll use direct publish for simplicity)
      try {
        publishEvent("order.events", "order.placed", {
          orderId: order.id,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
          tableId,
          customerId,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        logger.error("Failed to publish OrderPlaced event", err);
        // Could implement a retry mechanism here
      }

      return { orderId: order.id, status: order.status };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Update order status.
   * If status becomes 'cancelled' or 'completed', emit appropriate events.
   */
  async updateStatus(orderId, status, reason = null) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new NotFoundError("Order");

    // Basic state machine (prevent invalid transitions)
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

    // Emit events for compensation or reporting
    if (status === "cancelled") {
      publishEvent("order.events", "order.cancelled", {
        orderId,
        reason: reason || "Cancelled by staff",
        items: await this.getOrderItems(orderId),
      });
    } else if (status === "completed") {
      publishEvent("order.events", "order.completed", {
        orderId,
        completedAt: new Date().toISOString(),
      });
    }

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
